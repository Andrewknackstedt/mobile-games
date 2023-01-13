import { HttpClient, HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, isDevMode } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const dtrum = window['dtrum'] || null;

export type FetchOptions = {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    body?: any,
    observe?: 'body' | 'events' | 'response';
    reportProgress?: boolean;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials?: boolean;
}

@Injectable({
    providedIn: "root"
})
export class Fetch {
    constructor(private http: HttpClient) { }

    // Public interface for making AJAX transactions
    public get<T>(url: string, options: FetchOptions = {}, returnError = false): Promise<T> {
        return this.request<T>("get", url, options, returnError);
    }
    public put<T>(url: string, body: any, options: FetchOptions = {}): Promise<T> {
        options.body = (options.body && Object.keys(options.body).length > 0 ? options.body : body) || {};
        return this.request<T>("put", url, options);
    }
    public post<T>(url: string, body: any, options: FetchOptions = {}): Promise<T> {
        options.body = (options.body && Object.keys(options.body).length > 0 ? options.body : body) || {};
        return this.request<T>("post", url, options);
    }
    public patch<T>(url: string, body: any, options: FetchOptions = {}): Promise<T> {
        options.body = (options.body && Object.keys(options.body).length > 0 ? options.body : body) || {};
        return this.request<T>("patch", url, options);
    }
    public delete<T>(url: string, options: FetchOptions = {}): Promise<T> {
        return this.request<T>("delete", url, options);
    }

    // Internally, handle the observable as a promise.
    private request<T>(method: string, url: string, options: FetchOptions = {}, returnError = false): Promise<T> {
        options.reportProgress = true;

        // Allow support for different response types.
        // Generally we shouldn't need this to be anything other than JSON.
        options.responseType = "text";//options.responseType || "json";
        options.withCredentials = true;

        const p = new Promise((resolve, reject) => {
            const o = this.http.request(method, url, options)
                .pipe(retry({
                    delay(error, retryCount) {
                        if (error.status == 429 || error.status == 500)
                            return of({});

                        if (error.status == 504 && isDevMode())
                            alert("Connect to the Azure VPN");

                        throw error;
                    },
                    count: 2
                }), catchError(err => {
                    if (returnError)
                        throw err;
                    console.error(err);
                    return of(null);
                }))
                .subscribe(data => {
                    try {
                        const d = JSON.parse(data);
                        resolve(d as unknown as T);
                    }
                    catch(err) {
                        resolve(data as unknown as T);
                    }
                    // Release object
                    o.unsubscribe();
                });
        });

        return p as Promise<T>;
    }
}
