// import { Component, Injectable, Inject } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { checkIfLazyComponentExists } from '../directives/loader.directive';


// @Injectable({
//     providedIn: 'root'
// })
// export class DialogService {

//     dialogRef: MatDialogRef<unknown, any>;

//     constructor(
//         private dialog: MatDialog,
//     ) { }

//       /**
//      * Open a dialog item.
//      *
//      * @param name Which dialog to open
//      * @returns
//      */
//     open(name: string, data = {}): Promise<void> {
//         return new Promise((resolve, reject) => {
//             this.closeDialog();

//             const icon =  document.body.querySelector("." + name)?.firstElementChild;
//             icon?.classList.add("active");

//             let component = dialogs[name];

//             // Inject a lazy component data and args
//             if (!component && checkIfLazyComponentExists(name)) {
//                 component = LazyDialogComponent;
//                 data = {
//                     id: name,
//                     args: data
//                 }
//             }

//             if (component == null) {
//                 console.error("Tried to open missing dialog " + name);
//                 return;
//             }

//             this.dialogRef = this.dialog.open(component as any, {
//                 maxHeight: "90vh",
//                 maxWidth: "90vw",
//                 panelClass: ["dialog-" + name],
//                 closeOnNavigation: true,
//                 restoreFocus: true,
//                 data
//             });

//             this.dialogRef.afterClosed().subscribe(result => {
//                 icon?.classList.remove("active");
//                 // this.dialogRef = null;
//                 resolve();
//             });
//         })
//     }

//     closeDialog():void {
//         this.dialogRef?.close();
//     }

//     // Open a confirmation dialog. Will reject if a cancel occurs.
//     confirmAction(title: string, message: string): Promise<void> {
//         return new Promise((res, rej) => {
//             this.dialogRef = this.dialog.open(ConfirmationComponent, {
//                 maxHeight: "90vh",
//                 maxWidth: "90vw",
//                 panelClass: ["dialog-" + name],
//                 closeOnNavigation: true,
//                 restoreFocus: true,
//                 data: {title, message}
//             });

//             this.dialogRef.afterClosed().subscribe(result => {
//                 result == true ? res() : rej();
//             });
//         })
//     }
// }

// /**
//  * A simple component that exists as a interface for lazy loading components
//  * in a material dialog.
//  */
// @Component({
//     template: `<ng-template [lazyLoad]="args.id" [lazyLoadArgs]="args.data"></ng-template>`
// })
// export class LazyDialogComponent {
//     constructor(@Inject(MAT_DIALOG_DATA) public args) {}
// }
