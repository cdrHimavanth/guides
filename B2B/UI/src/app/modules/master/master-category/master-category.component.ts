import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Apollo } from "apollo-angular";
import { GET_MASTER_CATEGORY, GET_MASTER_CATEGORY_LIST } from "app/gqloperations/getQueries.operations";
import { MatDrawer } from "@angular/material/sidenav";
import { EditMasterComponent } from "./edit-master/edit-master.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MasterService } from "../master.service";

@Component({
  selector: "app-master-category",
  templateUrl: "./master-category.component.html",
  styleUrls: ["./master-category.component.scss"],
})
export class MasterCategoryComponent implements OnInit {
  drawerMode: "over" | "side" = "over";
  drawerOpened: boolean = false;
  displayedColumns = ["masterCategory"];
  dataSource = new MatTableDataSource<any>([]);

  activeDrawer: MatDrawer | null = null;

  isChecked = true;
  isLoading: boolean = false;
  isMatDrawerOpend: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('firstDrawer') firstDrawer!: MatDrawer;
  @ViewChild(EditMasterComponent) editMaster: EditMasterComponent;

  onEditDrawerOpened() {
    this.editMaster.triggerWhenMatdrweropend();
  }

  constructor(private apollo: Apollo, private masterService: MasterService) {}



  ngOnInit(): void {
    // this.dataSource.data = MASTER_DATA;
    this.apollo
      .watchQuery({
        query: GET_MASTER_CATEGORY_LIST,
      })
      .valueChanges.subscribe((data: any) => {
        this.dataSource.data = data.data.getMasterCategories;
        setTimeout(() => (this.dataSource.paginator = this.paginator), 10);
        setTimeout(() => (this.dataSource.sort = this.sort), 10);
      });
  }

  edit() {
    this.isMatDrawerOpend = true;
    // this.firstDrawer.toggle();
  }

  toggleDrawer(drawer: MatDrawer,data:any): void {
    this.masterService.getEditMasterDetails().next(data);
    this.isMatDrawerOpend = true;
    drawer.toggle();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDrawer() {
    this.drawerOpened = true;
  }

}

