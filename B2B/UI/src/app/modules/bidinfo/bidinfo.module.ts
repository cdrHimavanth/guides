
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Route, RouterModule } from "@angular/router";
import { BidinfoComponent } from "./bidinfo.component";
import { EditBidinfoComponent } from "./edit-bidinfo/edit-bidinfo.component";
import { TruncatePipe } from "./pipes/truncate";
import {MatRadioModule} from '@angular/material/radio';

const bidInfoRoutes: Route[] = [
  {
    path: "",
    component: BidinfoComponent,
  },
];

@NgModule({
  declarations: [BidinfoComponent, EditBidinfoComponent, TruncatePipe],
  imports: [
    MatSortModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatSidenavModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatTooltipModule,
    RouterModule.forChild(bidInfoRoutes),
  ],
  providers: [DatePipe]

})
export class BidinfoModule {}
