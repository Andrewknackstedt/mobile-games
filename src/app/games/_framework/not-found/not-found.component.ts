import { Component, Input, OnDestroy, NgModule } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    imports: [ CommonModule, MatButtonModule ],
    standalone: true
})
export class NotFoundComponent {

    @Input() scope = "";
    @Input() error: Error;

    isNewVersion = false;
    visible = false;
    _sub: Subscription;
    constructor() {
    }
}
