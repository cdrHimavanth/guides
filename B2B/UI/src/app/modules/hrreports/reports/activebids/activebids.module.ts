import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'app/shared/shared.module';
import {MatExpansionModule} from '@angular/material/expansion';

import { ActivebidsComponent } from './activebids.Component';



const ActiveBidsRoutes: Route[] = [
    {
        path     : '',
        component: ActivebidsComponent
    }
];

@NgModule({
    declarations: [
        ActivebidsComponent,
    ],
    imports     : [
        MatFormFieldModule,
        MatPaginatorModule,
        MatTableModule,
        SharedModule,
        MatExpansionModule,
        RouterModule.forChild(ActiveBidsRoutes)
       
    ]
})
export class activeBidsModule
{
}
