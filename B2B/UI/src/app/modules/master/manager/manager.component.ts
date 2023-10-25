import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { GET_ALL_MANAGERS } from 'app/gqloperations/getQueries.operations';
import { EditManagerComponent } from './edit-manager/edit-manager.component';
import { AddManagerComponent } from './add-manager/add-manager.component';
import { ManagerService } from './manager.service';


const MANAGER_DATA = [
  {
    'managerId':1,
    'll6Manager':'swamy',
    'll5Manager':'teja',
    'll4Manager':'chintu',
    'll3Manager':'durga',
    'll2Manager':'frienduu'
  },
  {
    'managerId':2,
    'll6Manager':'amal',
    'll5Manager':'rakesh',
    'll4Manager':'rakee',
    'll3Manager':'ar',
    'll2Manager':'rak'
  },
  {
    'managerId':3,
    'll6Manager':'rahul',
    'll5Manager':'ravi',
    'll4Manager':'indra',
    'll3Manager':'mrr',
    'll2Manager':'rravi'
  },
  {
    'managerId':4,
    'll6Manager':'sri',
    'll5Manager':'ranga',
    'll4Manager':'veera',
    'll3Manager':'lakshmi',
    'll2Manager':'naren'
  },
  {
    'managerId':5,
    'll6Manager':'sai',
    'll5Manager':'vamsi',
    'll4Manager':'krishna',
    'll3Manager':'thorthi',
    'll2Manager':'naren'
  },
  {
    'managerId':6,
    'll6Manager':'raghu',
    'll5Manager':'ram',
    'll4Manager':'reddy',
    'll3Manager':'thorthi',
    'll2Manager':'naren'
  }
]



@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  drawerMode: "over" | "side" = "over";
  drawerOpened: boolean = false;
  displayedColumns = ["ll6Manager", "ll5Manager","ll4Manager", "ll3Manager","ll2Manager"];
  dataSource = new MatTableDataSource<any>([]);

  activeDrawer: MatDrawer | null = null;

  isChecked = true;
  isLoading: boolean = false;
  isMatDrawerOpend: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('firstDrawer') firstDrawer!: MatDrawer;
  @ViewChild('secondDrawer') secondDrawer!: MatDrawer;
  @ViewChild(EditManagerComponent) editManager: EditManagerComponent;
  @ViewChild(AddManagerComponent) addManager: AddManagerComponent;

  onEditDrawerOpened() {
    this.editManager.triggerWhenMatdrweropend();
  }

  onAddDrawerOpened() {
    this.addManager.triggerWhenMatdrweropend();
  }

  constructor(private apollo: Apollo, private managerService: ManagerService) {}

  extraDrawerOpened = false;
extraDrawerContent = '';

editForm: FormGroup;
selectedRow: any;


closeExtraDrawer() {
  this.extraDrawerOpened = false;
}




  ngOnInit(): void {
    // this.dataSource.data = MANAGER_DATA;
    this.apollo
      .watchQuery({
        query: GET_ALL_MANAGERS,
        fetchPolicy: 'no-cache'
      })
      .valueChanges.subscribe((data: any) => {

        this.dataSource.data = data.data.getLL6List;
        setTimeout(() => (this.dataSource.paginator = this.paginator), 10);
        setTimeout(() => (this.dataSource.sort = this.sort), 10);
      });
  }
  closeDrawer(){
    this.drawerOpened = false;
 }

  edit() {
    this.isMatDrawerOpend = true;
    // this.firstDrawer.toggle();
  }

  toggleDrawer(drawer: MatDrawer,data:any): void {
    this.managerService.getEditManagerDetails().next(data);
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


