import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { HrreportsService } from "../hrreports.service";



@Component({
  selector: "app-positionbymonth",
  templateUrl: "./positionbymonth.component.html",
  styleUrls: ["./positionbymonth.component.scss"],
})
export class PositionbymonthComponent implements OnInit {
  displayedColumns: string[] = [
    "broadcastDate",
    "orderNo",
    "noOfPositions",
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // filterByMonth = new UntypedFormControl("");
  // overallFilter = new UntypedFormControl("");

  // filterValues = {
  //   byMonth: "",
  //   overallFilter: "",
  // };

  searchControl = new FormControl("");

  applyFilter() {
    const filterValue = this.searchControl.value.toLowerCase();

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(private hrreportservice: HrreportsService) {
    }

  ngOnInit(): void {
    this.hrreportservice.getPositionByMonthDetails().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<any>(data);
    
      
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },100);
    });
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

}
