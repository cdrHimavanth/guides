import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { HrreportsService } from "../hrreports.service";
import { B2bAlertMessageService } from "app/shared/b2b-alert-message.service";

@Component({
  selector: "app-activebids",
  templateUrl: "./activebids.component.html",
  styleUrls: ["./activebids.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ActivebidsComponent implements OnInit {
  displayedColumns: string[] = [
    "orderNo",
    "countOfProfile",
    "stratification",
    "skillGroup",
    "primarySkill",
  ];
  dataSource: MatTableDataSource<any>;
  bidList;
  commaSeparatedNames;
  currentSelectedRow;
  namesList:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // overallFilter = new UntypedFormControl("");

  searchControl = new FormControl("");

  applyFilter() {
    const filterValue = this.searchControl.value.toLowerCase();

    this.dataSource.filter = filterValue.trim();
  }


  constructor(private hrService: HrreportsService,private alertService:B2bAlertMessageService,) {

  }

  ngOnInit(): void {
    this.hrService.getBidReports().subscribe((data: any) => {
      console.log(data)
      this.bidList = data;

      this.dataSource = new MatTableDataSource(data);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }

  isRightCanvasOpen = false;

  viewName(orderNo: any, bidNameList: any) {
    this.namesList = bidNameList;
     // Assuming it's always a single string in the list
    if(bidNameList !== null){

      this.commaSeparatedNames = this.namesList[0];
      const individualNames: string[] = this.commaSeparatedNames.split(',')
      .map(name => name.trim()); // Split the string by comma and trim each individual name
 
     this.namesList = individualNames;
     console.log(this.namesList);
 
     this.currentSelectedRow = this.bidList.filter((eachRow) => {
 
       return eachRow.orderNo === orderNo;
     });
 
     this.isRightCanvasOpen = !this.isRightCanvasOpen;
 
     this.generateBackgroundColors();
    } else{
      this.alertService.showError("No Submitted Profiles for orderNo : " + orderNo);
    }


  }

  toggleOffcanvas(){
    this.isRightCanvasOpen = !this.isRightCanvasOpen;
  }


  colors: string[] = ['#1E293B', '#596880'];
  backgroundColors: string[] = [];
  
  generateBackgroundColors() {
    this.backgroundColors = this.namesList.map((name, index) => {
      const colorIndex = index % this.colors.length;
      return this.colors[colorIndex];
    });
  }

}
