import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { HrreportsService } from '../hrreports.service';




@Component({
  selector: 'app-positionsbyskill',
  templateUrl: './positionsbyskill.component.html',
  styleUrls: ['./positionsbyskill.component.scss']
})
export class PositionsbyskillComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['skillSet', 'noOfPositions',];
  dataSource = new MatTableDataSource<any>([]);
  searchControl = new FormControl('');
  newData = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public hrService: HrreportsService) { }

  isGroup(index, item): boolean {
    return item.isGroupBy;
  }

  applyFilter() {
    this.dataSource.filter = this.searchControl.value.trim().toLowerCase();
   
    
  }
  
  
  ngAfterViewInit(): void {
    
  }
  ngOnInit(): void {
    this.serviceCall1();
    this.dataSource.paginator = this.paginator;
  }
  serviceCall1() {
    let sampleData
    this.hrService.getPositionBySkillDetails().subscribe((data) => {
      sampleData = data
      
      sampleData.forEach(group => {
        // Create an object for the group's skillGroup and totalPositions
        const groupObject = {
          skillGroup: group.skillGroup,
          totalPositions: group.totalPositions,
          isGroupBy: true
        };
        // Add the group object to the new data array
        this.newData.push(groupObject);
        // Loop through the group's skillSet array and add each skill to the new data array
        group.skillSet.forEach(skill => {
          const skillObject = {
            skillSet: skill.name,
            noOfPositions: skill.noOfPositions
          };
          if(skillObject.skillSet !==null){
            this.newData.push(skillObject);
          }
          console.log()
          
        });
      });
    
      setTimeout(()=>{
        this.dataSource.paginator = this.paginator;
      },100);
      this.dataSource.data = this.newData
      
    })
  }

}
