import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { CandidateInfoComponent } from './candidate-info.component';
import { TruncatePipe } from './pipe/truncate.pipe';


const candidateInfoRoutes: Route[] = [
  {
    path: '',
    component: CandidateInfoComponent
  }
];
@NgModule({
  declarations: [
    CandidateInfoComponent,
    TruncatePipe
  ],
  imports: [
    RouterModule.forChild(candidateInfoRoutes),
    CommonModule,
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
export class CandidateInfoModule { }
