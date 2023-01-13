import { Directive, Input, ViewContainerRef, OnInit, Component, isDevMode, ComponentRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegisteredComponents } from '../component.registry';
import { NotFoundComponent } from '../games/_framework/not-found/not-found.component';

export const ComponentRegistry =
    RegisteredComponents
    .map(c => ({ ...c, id: c.id.toLowerCase() }));

export const checkIfLazyComponentExists = (id: string) => {
    return true;
}

@Directive({
    selector: 'ng-template[lazyLoad]'
})
export class LazyLoaderDirective implements OnInit {

    /**
     * The id of the component that will be lazy loaded
     */
    private _id: string;
    @Input("lazyLoad") set id(id: string) {
        if (this._id) {
            // clear
            this.container.remove();
        }
        this._id = id;
    };

    /**
     * The data representing the item the context-menu was opened for.
     */
    @Input("lazyLoadArgs") data: any;

    constructor(private container: ViewContainerRef) { }

    private spinner: ComponentRef<LoaderComponent>;

    async ngOnInit() {
        this.spinner = this.container.createComponent(LoaderComponent);

        if (!this._id) {
            console.log("lazyload missing id", this._id);
            return this.loadDefault();
        }

        try {
            const entry = ComponentRegistry.find(c => c.id == this._id.toLowerCase());
            if (!entry) {
                console.error(`Failed to find Component/Module [${this._id}] in registry!`);
                return this.loadDefault();
            }

            const module = await entry.load();

            const component = Object.keys(module)
                .filter(k => k.endsWith("Component"))
                .map(k => module[k])[0];

            if (!component) {
                console.error(`Component/Module [${this._id}] is invalid or corrupted!`);
                return this.loadDefault();
            }

            const componentRef = this.container.createComponent(component);
            const instance: any = componentRef['instance'];

            const name = instance.__proto__?.constructor?.name;
            console.log("lazy loading", name)

            const args = this.data;

            // Questionable detection for if the component looks for a "params" object.
            if (args?._value?.__proto__?.constructor?.name == "URLSearchParams")
                instance.params = this.data;

            // if (!!instance.params)
            // if (!!instance.lazyLoadArgs)
            instance.lazyLoadArgs = this.data;

            this.clearSpinner();

            return componentRef;
        }
        catch (ex) {
            console.error("Loading component", ex);
            // Network errors throw a toast and return an error component
            if (ex && !isDevMode())
                throw ex;

            return this.loadDefault();
        }
    }

    private clearSpinner() {
        this.spinner.instance.isDestroying = true;
        setTimeout(() => {
            this.spinner.destroy();
        }, 300);
    }

    private loadDefault() {
        console.info("Loading default component in place of failed component.");
        this.container.createComponent(NotFoundComponent);

        this.clearSpinner();
    }
}

@Component({
    selector: 'app-loader',
    template: `
    <div [class.clear]="isDestroying">
        <mat-progress-spinner mode='indeterminate'></mat-progress-spinner>
        <h3>Loading...</h3>
    </div>
    `,
    styles: [`
    :host{display: contents}
    div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        z-index: 9999;
        background: #efefef;
        width: 100%;
        height: 100%;
        color: #212121;
        --mdc-circular-progress-active-indicator-color: #212121;


        transition: opacity 300ms ease-in-out;
        &.clear {
            opacity: 0
        }
    }
    h3 {
        color: #212121;
    }
    `],
    imports: [MatProgressSpinnerModule],
    standalone: true
})
class LoaderComponent {
    @Input() isDestroying = false;
}
