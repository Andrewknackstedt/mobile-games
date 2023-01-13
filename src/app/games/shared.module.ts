import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoaderDirective } from '../directives/loader.directive';
// import { LazyDialogComponent } from '../services/dialog.service';

@NgModule({
  declarations: [
    LazyLoaderDirective,
    // LazyDialogComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    LazyLoaderDirective
  ],
})

export class SharedModule { }
