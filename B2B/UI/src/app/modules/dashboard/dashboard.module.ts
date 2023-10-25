import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './has-role.directive';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { PositionsComponent } from '../positions/positions.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { GraphMultipleComponent } from './graph-multiple/graph-multiple.component';
import { MatTooltipModule } from '@angular/material/tooltip';


const dashboardRoutes: Route[] = [
  {
      path     : '',
      component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    HasRoleDirective,
    GraphMultipleComponent
  ],
  imports: [
    RouterModule.forChild(dashboardRoutes),
    MatIconModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatGridListModule,
    NgxChartsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatProgressSpinnerModule,  
    NgApexchartsModule,
    MatTooltipModule

    
   
  ],
  providers: [
    PositionsComponent
  ]
})
export class DashboardModule { }
