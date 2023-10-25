import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CandidateInfoService } from './candidate-info.service';
import {Location} from '@angular/common'
@Component({
  selector: 'app-candidate-info',
  templateUrl: './candidate-info.component.html',
  styleUrls: ['./candidate-info.component.scss']
})
export class CandidateInfoComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  isLoading = false
  isChecked = true;
  searchTerm: any; // search input
  candidateInfo ;
  isHoveredBackBtn = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatDrawer) matdrawer: MatDrawer;
  constructor( private candidateService: CandidateInfoService,private location: Location) { }

  ngOnInit(): void {
    this.getAllCandidateInfo()
  }
  displayedColumns: string[] =  ["fileId", "candidateName", "orderNo", "candidateRate", "candidateSubmissionDate" ,"candidateDeclinedCode", "candidateDeclinedReason", "candidateDeclinedDate","candidateStatus"]
  // candidateActiveStatus
  getAllCandidateInfo() {
    this.isLoading = true
    this.candidateService.getAllCandidates().subscribe(
      (candidateData) => {
      this.candidateInfo = candidateData;
      this.dataSource.data  = this.candidateInfo;
      console.log(candidateData)
      setTimeout(() => this.dataSource.paginator = this.paginator, 10);
      setTimeout(() => this.dataSource.sort = this.sort, 10);
      this.isLoading = false
    });
  }
 

  filterTable(searchTerm: string) {
    this.dataSource.filter = searchTerm.trim().toLocaleLowerCase();
    const filterValue = searchTerm;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onBack(){
    this.location.back();
  }
 

}
