import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Route, RouterModule } from '@angular/router';
import { HrreportsComponent } from './hrreports.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncatePipe } from './pipes/truncate';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'app/shared/shared.module';
import { ActivebidsComponent } from './activebids/activebids.component';
import { PositionbymonthComponent } from './positionbymonth/positionbymonth.component';
import { PositionsbyskillComponent } from './positionsbyskill/positionsbyskill.component';
import { RecruiterassignmentdetailsComponent } from './recruiterassignmentdetails/recruiterassignmentdetails.component';
import { DetailsComponent } from '../hrreports/recruiterassignmentdetails/details/details.component';
import { AttemptedPositionsInfoComponent } from './attempted-positions-info/attempted-positions-info.component';
import { AllordersbymonthComponent } from './allordersbymonth/allordersbymonth.component';


const hrReportsRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        // redirectTo: 'recruiter-assignment'
        component:HrreportsComponent
    },
];

@NgModule({
    declarations: [
        HrreportsComponent,
        RecruiterassignmentdetailsComponent,
        DetailsComponent,
        PositionsbyskillComponent,
        PositionbymonthComponent,
        ActivebidsComponent,
        TruncatePipe,
        AttemptedPositionsInfoComponent,
        AllordersbymonthComponent
        
    ],
    imports     : [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule, 
        MatTableModule,
        MatSelectModule,
        MatTooltipModule,
        MatSortModule,
        MatButtonModule,
        MatExpansionModule,
        CommonModule,
        MatDialogModule,
        SharedModule,
        RouterModule.forChild(hrReportsRoutes)
    ]
})
export class HrreportsModule
{
}
