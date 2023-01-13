import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, isDevMode } from '@angular/core';

// What key does the theme get stored under on the 'localstorage' object.
const THEME_KEY = "theme";

@Injectable({
    providedIn: 'root'
})
export class ThemeLoaderService {
    readonly themes = [
        "dark",
        "light",
        "glassy"
    ];

    readonly defaultTheme = "light";

    constructor(@Inject(DOCUMENT) private document: Document) { }

    public loadStyle(styleName: string) {

        // Make sure we are loading a valid theme
        if (!styleName || !this.themes.includes(styleName))
          styleName = this.defaultTheme;

        // Get the head DOM element
        const head = this.document.getElementsByTagName('head')[0];
        localStorage[THEME_KEY] = styleName;

        // Get the <link> element that we will update.
        let themeLink = this.document.getElementById('client-theme') as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = styleName + '.css';
        }
        else {
            // We don't have the <link> element yet, so create it.
            const style = this.document.createElement('link');
            style.id = 'client-theme';
            style.rel = 'stylesheet';
            
            style.href = isDevMode() ? `/${styleName}.css` : `/ui/${styleName}.css`;

            head.appendChild(style);
        }

        try {
            const iframe = this.document.querySelector("app-frame iframe") as HTMLIFrameElement;
            iframe.contentWindow['loadTheme'](styleName);
        }
        catch(ex) {
            // This is not a definite indicator of a problem. 
            // This mainly exists for debugging purposes when a child _should_ be themed
            // but does not end up getting the theme set.
            // console.warn("Failed to set theme on child iframe.", ex);
        }
    }

    public restoreTheme() {
        this.loadStyle(localStorage[THEME_KEY]);
    }
}
