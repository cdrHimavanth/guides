import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Route, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { FuseNavigationModule } from "@fuse/components/navigation";
import { FuseScrollResetModule } from "@fuse/directives/scroll-reset";
import { FuseScrollbarModule } from "@fuse/directives/scrollbar";
import { FuseFindByKeyPipeModule } from "@fuse/pipes/find-by-key";
import { SharedModule } from "app/shared/shared.module";
import { ManagerComponent } from "./manager/manager.component";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MasterCategoryComponent } from "./master-category/master-category.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { MasterComponent } from "./master.component";
import { EditMasterComponent } from "./master-category/edit-master/edit-master.component";
import { AddManagerComponent } from "./manager/add-manager/add-manager.component";
import { EditManagerComponent } from "./manager/edit-manager/edit-manager.component";
import { AddBusinessUnitComponent } from "./businessunit/add-businessunit/add-businessunit.component";
import { EditBusinessUnitComponent } from "./businessunit/edit-businessunit/edit-businessunit.component";
import { BusinessUnitComponent } from "./businessunit/businessunit.component";

const masterRoutes: Route[] = [
  {
    path      : '',
    redirectTo: 'managers',
    pathMatch : 'full'
},
  {
    path: "",
    component: MasterComponent,
    children : [
      {
          path     : 'managers',
          component: ManagerComponent
      },
      {
        path     : 'businessunit',
        component: BusinessUnitComponent
    },
    {
      path     : 'master',
      component: MasterCategoryComponent
  }
  ]
  },
];

@NgModule({
  declarations: [
    MasterComponent,
    ManagerComponent,
    BusinessUnitComponent,
    MasterCategoryComponent,
    EditMasterComponent,
    AddManagerComponent,
    EditManagerComponent,
    AddBusinessUnitComponent,
    EditBusinessUnitComponent
  ],
  imports: [
    RouterModule.forChild(masterRoutes),
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    FuseFindByKeyPipeModule,
    FuseNavigationModule,
    FuseScrollbarModule,
    FuseScrollResetModule,
    SharedModule,
    MatCardModule,
    
  ],
})
export class MasterModule {}
