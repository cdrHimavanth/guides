import {  Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";


import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { DetailsComponent } from "./details/details.component";
import { HttpClient } from "@angular/common/http";
import { HrreportsService } from "../hrreports.service";

/** Constants used to fill up our data base. */
const ORDERNUMBER: any = [];





export interface RecruiterAssignmentDetails {
  recruiterName: string;
 
  orderNumber: string;
  noOfPositions: string;
  details: string;
}

@Component({
  selector: "app-recruiterassignmentdetails",
  templateUrl: "./recruiterassignmentdetails.component.html",
  styleUrls: ["./recruiterassignmentdetails.component.scss"],
})
export class RecruiterassignmentdetailsComponent implements OnInit {
  orderNumbers = ORDERNUMBER;
  recruitersDetails: any[] = [];
  displayedColumns: string[] = [
    "recruiter",
    "orderCount",
    "noOfPositions",
    "details",
  ];
  dataSource = new MatTableDataSource<any>();

 
  @ViewChild("paginator") paginator: MatPaginator;


  
  searchControl = new FormControl("");
  errorMessage: string;
  public showDiv: boolean = false;

  recruiterName: string = "";
  ordersData: any;
  applyFilter() {
    const filterValue = this.searchControl.value.toLowerCase();

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private hrreportservice: HrreportsService,
    public dialog: MatDialog,
    private http: HttpClient,
   
  ) {}

  ngOnInit(): void {
    this.getRecruiterAssignmentdetails();
    
   
    
  }

  getRecruiterAssignmentdetails() {
    this.hrreportservice.getRecruiterDetails().subscribe((data: any) => {
      this.recruitersDetails = data;
    
      this.dataSource.data = data;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
       
      }, 100);
    });
    
    
    
    
  }

   openDialog(row: any) {
    if (this.recruitersDetails) {
      this.hrreportservice.getDetails(row.recruiter).subscribe((data1 :any)=>{
       
        this.ordersData = data1

       console.log(row.recruiter)
        const dialogRef = this.dialog.open(DetailsComponent, {
          data: {
            data: this.ordersData,
          },
        });
      });
      
      
    }
  }
 
}
