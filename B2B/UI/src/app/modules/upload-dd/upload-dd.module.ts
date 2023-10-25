import { MatSelectModule } from '@angular/material/select';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { UploadDdComponent } from './upload-dd.component';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PositionUploadComponent } from './position-upload/position-upload.component';
import { BidinfoUploadComponent } from './bidinfo-upload/bidinfo-upload.component';
import { DndDirective } from './dnd.directive';
import { PositionPdfUploadComponent } from './position-upload/position-pdf-upload/position-pdf-upload.component';
import { MatTableModule } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CandidateSubmissionUploadComponent } from './candidate-submission-upload/candidate-submission-upload.component';
import { CandidateDeclineUploadComponent } from './candidate-decline-upload/candidate-decline-upload.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

const uploadsDdRoutes: Route[] = [
    {
        path     : '',
        component: UploadDdComponent
    }
];

@NgModule({
    declarations: [
        UploadDdComponent,
        PositionUploadComponent,
        BidinfoUploadComponent,
        DndDirective,
        PositionPdfUploadComponent,
        CandidateSubmissionUploadComponent,
        CandidateDeclineUploadComponent,
    ],
    imports: [
        MatCardModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        MatIconModule,
        MatButtonModule,
        SharedModule,
        MatSelectModule,
        FuseAlertModule,
        FuseCardModule,
        RouterModule.forChild(uploadsDdRoutes)
    ]
})

export class UploadsDdModule
{
}