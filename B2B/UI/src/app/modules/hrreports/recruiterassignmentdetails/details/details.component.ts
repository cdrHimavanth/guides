import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  displayedColumns: string[] = ['orderNumber', 'noOfPositions'];
  dataSource= new MatTableDataSource<any>();
  
  constructor(@Inject(MAT_DIALOG_DATA)private data: any) { }
 

  ordersData:any=this.data.data;
  
  ngOnInit(): void {
    console.log(this.data)
    this.dataSource.data = this.ordersData
  }

}
