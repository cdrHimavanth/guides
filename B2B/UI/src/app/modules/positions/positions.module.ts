import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import {MatCardModule} from '@angular/material/card';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from './details/details.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PositionsComponent } from './positions.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TruncatePipe } from './pipe/truncate.pipe';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

const positionRoutes: Route[] = [
    {
        path     : '',
        component: PositionsComponent
    }
];

@NgModule({
    declarations: [
        PositionsComponent,
        DetailsComponent,
        TruncatePipe,
    ],
    imports     : [
        RouterModule.forChild(positionRoutes),
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatMenuModule,
        MatButtonModule,
        MatSidenavModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatCardModule,
        HttpClientModule,
        SharedModule,
        MatTooltipModule,
        MatProgressSpinnerModule
    ]
})

export class PositionModule { }
