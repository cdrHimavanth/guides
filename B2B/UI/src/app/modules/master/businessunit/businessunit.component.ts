import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { GET_BUSINESS_UNIT } from 'app/gqloperations/getQueries.operations';
import { EditBusinessUnitComponent } from './edit-businessunit/edit-businessunit.component';
import { AddBusinessUnitComponent } from './add-businessunit/add-businessunit.component';
import { BusinessUnitService } from './businessunit.service';

const BUSINESS_UNIT_LIST = [
  {
    'businessUnitId':1,
    'businessUnitName':'Not Known'
  },
  {
    'businessUnitId':2,
    'businessUnitName':'Ford Pass'
  },
  {
    'businessUnitId':3,
    'businessUnitName':'Ford Blue'
  },
  {
    'businessUnitId':4,
    'businessUnitName':'Ford Credit'
  }
]



@Component({
  selector: 'app-businessunit',
  templateUrl: './businessunit.component.html',
  styleUrls: ['./businessunit.component.scss']
})
export class BusinessUnitComponent implements OnInit {

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = false;
  displayedColumns = ['businessUnitName'];
  dataSource = new MatTableDataSource<any>([]);
  

  activeDrawer: MatDrawer | null = null;

  isChecked = true;
  isLoading: boolean = false;
  isMatDrawerOpend: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('firstDrawer') firstDrawer!: MatDrawer;
  @ViewChild('secondDrawer') secondDrawer!: MatDrawer;
  @ViewChild(EditBusinessUnitComponent) editbusinessunit: EditBusinessUnitComponent;
  @ViewChild(AddBusinessUnitComponent) addbusinessunit: AddBusinessUnitComponent;

  onEditDrawerOpened() {
    this.editbusinessunit.triggerWhenMatdrweropend();
  }

  onAddDrawerOpened() {
    this.addbusinessunit.triggerWhenMatdrweropend();
  }


  


  constructor(private apollo:Apollo, private businessUnitService: BusinessUnitService) { }

  ngOnInit(): void {
    // this.dataSource.data = BUSINESS_UNIT_LIST;
    this.apollo
      .watchQuery({
        query: GET_BUSINESS_UNIT,
        fetchPolicy: 'no-cache'
      })
      .valueChanges.subscribe((data: any) => {

        this.dataSource.data = data.data.getBusinessUnitList;
        setTimeout(() => (this.dataSource.paginator = this.paginator), 10);
        setTimeout(() => (this.dataSource.sort = this.sort), 10);
      });
  }

  edit() {
    this.isMatDrawerOpend = true;
    // this.firstDrawer.toggle();
  }

  toggleDrawer(drawer: MatDrawer,data:any): void {
    this.businessUnitService.getEditBusinessUnitDetails().next(data);
    this.isMatDrawerOpend = true;
    if (drawer === this.firstDrawer && this.secondDrawer.opened) {
      this.secondDrawer.close();
    } else if (drawer === this.secondDrawer && this.firstDrawer.opened) {
      this.firstDrawer.close();
    }
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




