import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HrreportsService } from '../hrreports.service';

@Component({
  selector: 'app-allordersbymonth',
  templateUrl: './allordersbymonth.component.html',
  styleUrls: ['./allordersbymonth.component.scss']
})
export class AllordersbymonthComponent implements OnInit {

  displayedColumns: string[] = [
    "broadcastDate",
    "orderNo",
    "noOfPositions",
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  searchControl = new FormControl("");

  applyFilter() {
    const filterValue = this.searchControl.value.toLowerCase();

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(private hrreportservice: HrreportsService) {
    }

  ngOnInit(): void {
    this.hrreportservice.getAllOrdersByMonthDetails().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<any>(data);
    
      
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },100);
    });
  }
}
