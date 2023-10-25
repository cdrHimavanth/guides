import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HasRoleDirective } from './has-role.directive'
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule
    ],
    exports: [
        CommonModule,
        HasRoleDirective,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
      HasRoleDirective
    ]
})
export class SharedModule
{
}
