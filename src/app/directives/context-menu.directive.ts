import { Directive, Input, ViewContainerRef, ElementRef, HostListener, Inject, Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeyCommand } from '../services/keyboard.service';

export type ContextMenuItem = {
    /**
     * Label for the menu-item
     */
    label: string,
    /**
     * Callback method that is called when a user activates
     * a context-menu item.
     * Use the `contextMenuData` decorator for passing data.
     */
    action: <T = any>(evt: MouseEvent, data: T) => any,

    /**
     * Set whether the menu item appear disabled.
     */
    disabled?: boolean,
    /**
     * If a shortcut is set, the text-label.
     */
    shortcutLabel?: string,
    /**
     * Keyboard shortcut to activate this item.
     */
    shortcut?: KeyCommand,
    /**
     * Path to an icon to render on the left side of the item.
     */
    icon?: string,


    seperator?: boolean
} | "seperator";


@Directive({
    selector: '[contextMenu]'
})
export class ContextMenuDirective {

    /**
     * The data representing the item the context-menu was opened for.
     */
    @Input("contextMenuData") data: any;

    /**
     * The items that will be bound to the context menu.
     */
    @Input("contextMenuItems") menuItems: ContextMenuItem[];

    constructor(
        private element: ElementRef,
        private viewContainerRef: ViewContainerRef,
        private dialog: MatDialog
    ) {

    }

    private calcHeight() {
        return this.menuItems
            .map(i => typeof i == "string" ? 2 : 24)
            .reduce((a, b) => a + b, 0);
    }

    private calcWidth() {

        const items = this.menuItems
            .filter(i => i != "seperator");

        const lName = (items as any)
            .sort((a, b) => a.label.length - b.label.length)
            .pop().label;
        const lShort = (items as any)
            .sort((a, b) => a.label.length - b.label.length)
            .pop().label;

        // Create dummy div that will calculate the width for us.
        const div = document.createElement("div");
        div.style["font-size"] = "14px";
        div.style["position"] = "absolute";
        div.style["opacity"] = "0";
        div.style["pointer-events"] = "none";
        div.style["left"] = "-1000vw";

        div.innerText = lName + lShort;

        document.body.appendChild(div);

        // Get width
        const w = div.getBoundingClientRect().width;

        // Clear element out of DOM
        div.remove();

        return w;
    }

    @HostListener('contextmenu', ['$event'])
    private onContextMenu(evt: MouseEvent) {
        evt.preventDefault();

        const h = this.calcHeight();
        const w = this.calcWidth();

        const cords = {
            top: null,
            left: null,
            bottom: null,
            right: null
        }

        if (evt.clientY + h > window.innerHeight)
            cords.bottom = (window.innerHeight - evt.clientY) + "px";
        if (evt.clientX + w > window.innerWidth)
            cords.right = (window.innerWidth - evt.clientX) + "px";

        if (!cords.bottom) cords.top = evt.clientY + "px";
        if (!cords.right) cords.left = evt.clientX + "px";

        const dialogRef = this.dialog.open(ContextMenuComponent, {
            data: {
                data: this.data,
                items: this.menuItems
            },
            panelClass: "context-menu",
            position: cords,
            backdropClass: "context-menu-backdrop"
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}


/**
 * This component is the visual context menu
 */
@Component({
    selector: 'app-context-menu',
    template: `
<table>
    <tbody>
        <ng-container *ngFor="let item of items">
            <tr 
                *ngIf="item != 'seperator'" 
                [class.disabled]="item.disabled"
                (click)="!item.disabled && onMenuItemClick(item, $event)"
                >
                <td class="icon">
                    <img [src]="item.icon" />
                </td>
                <td class="label" [innerHTML]="formatLabel(item.label)">
                </td>
                <td class="shortcut">
                    {{item.shortcutLabel}}
                </td>
            </tr>
    
            <tr class="hr" *ngIf="item == 'seperator'"><td colspan="3"></td></tr>
        </ng-container>
    </tbody>
</table>
`,
    styles: [`
.cdk-overlay-container .context-menu-backdrop.cdk-overlay-backdrop-showing {
    opacity: 0;
}

.cdk-overlay-pane.context-menu {
    .mat-dialog-container {
        padding: 0;
    }
}

mat-dialog-container app-context-menu {
    table {
        border-spacing: 0;
        background: #2f2f2f;
        border-radius: 5px;
        padding: 4px 0;
    }
    
    tr {
        font-size: 14px;
    
        transition: background-color 75ms ease,
                    color 75ms ease;
    
        &:not(.disabled):hover {
            background-color: #94ebeb;
            .label {
                color: #000;
            }
        }
    
        .icon {
            width: 24px;
            height: 24px;
            padding-left: 10px;
        }
    
        .label {
            color: #ccc;
        }
    
        &.disabled .label {
            color: #919191;
        }
    
        .shortcut {
            color: #848484;
            text-align: end;
            padding-right: 10px;
        }
    
    
        td {
            vertical-align: middle;
        }
        &.hr td {
            height: 1px;
            background: #2a2a2a;
        }
    }
}
`],
    encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent {

    public data: any;
    public items: ContextMenuItem[];

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private _data: any) {
        this.data = _data.data;
        this.items = _data.items;
    }

    /**
     * 
     * @param item 
     * @param evt 
     * @returns 
     */
    onMenuItemClick(item: ContextMenuItem, evt: MouseEvent) {
        if (typeof item == 'string') return;
        item.action(evt, this.data);
        this.close();
    }

    /**
     * 
     * @param label 
     * @returns 
     */
    formatLabel(label: string): string {
        return label.replace(/_([a-z0-9])_/i, (match, group) => `<u>${group}</u>`)
    }

    /**
     * Close the context menu under these circumstances
     */
    @HostListener("window:resize", ['event'])
    @HostListener("window:blur", ['event'])
    close() {
        this.dialogRef.close();
    }
}
