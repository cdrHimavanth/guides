import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { MatDrawer } from "@angular/material/sidenav";
import { BidinfoService } from "./services/bidinfo.service";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { EditBidinfoComponent } from "./edit-bidinfo/edit-bidinfo.component";
import { SharedService } from "app/shared/shared.service";
import { BidFilterValues } from "app/shared/shared.data";
import {Location} from "@angular/common"

export interface BidInfoInterface {
  orderNo: number;
  bidNumber: number;
  bidName: string;
  bidStatus: string;
  bidRcvdDate: string;
  overTarget: string;
  bidRate: number;
  interviewDate: string;
  interviewResult: string;
  declinedCode: string;
  declinedReason: string;
  declinedDate: string;
  poNo: number;
  activeStatus: boolean;

}

@Component({
  selector: "app-bidinfo",
  templateUrl: "./bidinfo.component.html",
  styleUrls: ["./bidinfo.component.scss"],
})
export class BidinfoComponent implements OnInit,OnDestroy {

  dataSource = new MatTableDataSource<BidInfoInterface>();
  
  isChecked = true;
  bidInfoData: any;
  isLoading: boolean = false
  searchTerm: string = "";
  displayedColumns: string[] = ["orderNo", "bidNo", "bidName", "bidReceivedDate", "bidOverTarget", "bidExternalOrInternal", "bidSkillSet", "bidPoNumber", "bidStatus"]

  @ViewChild('searchInput') searchInput: ElementRef
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatDrawer) matdrawer: MatDrawer;
  @ViewChild(EditBidinfoComponent) editBidinfoComponent: EditBidinfoComponent
  isMatDrawerOpend: boolean = false;
  wildCardSearch: string =""
 
  orderNumberFilter = new FormControl('');
  bidNumberFilter = new FormControl('');
  profileSubmittedFilter = new FormControl('');
  bidRcvdDateFilter = new FormControl('');
  overTargetFilter = new FormControl('');
  externalOrInternalFilter = new FormControl('');
  skillSetFilter = new FormControl('');
  poNumberFilter = new FormControl('');
  bidStatusFilter = new FormControl('');
  wildSearchFilter = new FormControl('');

  startFilterControl= new FormControl()
  endFilterControl= new FormControl()
  isHoveredBackBtn = false;

  filtersVal = ["orderNumberFilter" , "bidNumberFilter" , "profileSubmittedFilter" , "bidRcvdDateFilter" , 
  "overTargetFilter" , "externalOrInternalFilter" , "skillSetFilter" , "poNumberFilter" , "bidStatusFilter"]
  filterValues = {
    orderNo:'',
    bidNo:'',
    bidName:'',
    // bidReceivedDate:'',
    bidReceivedDate: { start: null, end: null },

    bidOverTarget:'',
    bidExternalOrInternal:'',
    bidSkillSet:'',
    bidPoNumber:'',
    bidStatus:'',
  }

  wildCardFilterValues = {
    orderNo:'',
    bidNo:'',
    bidName:'',
    bidReceivedDate:'',
    bidOverTarget:'',
    bidExternalOrInternal:'',
    bidSkillSet:'',
    bidPoNumber:'',
    bidStatus:'',
    globalSearch:'',
  }

  filterControls: { [key: string]: FormControl } = {};
  range = new FormGroup({
    startFilterControl: this.startFilterControl,
    endFilterControl: this.endFilterControl,
  });
  constructor(private bidInfoService: BidinfoService, private shared: SharedService, private location : Location) {
    this.dataSource.filterPredicate = this.createFilter();

  }
  setDefaults(){
    let b;
    this.shared.bidfilterValuesSubject.subscribe({next:(a:BidFilterValues)=>{
      a.date=null;
    }})
    this.shared.bidInfoSearchStringSubject.next(b);
  }
  ngOnDestroy(): void {
    this.setDefaults();
  }
  bidFilter(){
    this.shared.bidfilterValuesSubject.subscribe({
      next:(a:BidFilterValues)=>{
        if(a.date!=null){
          this.range.patchValue({startFilterControl:a.date.start,endFilterControl:a.date.end})
        }
      }
    })
  }

  async ngOnInit() {
    this.shared.closedOpenToggleSubject.subscribe({
      next: (data: any) => {
        this.isChecked = data;
      }
    })
    await this.getAllBidInfo();
    await this.createSearchForm();
    await this.filterFormConfig();
    await this.bidFilter()
  }

  ngAfterViewInit(): void {
    
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
  }
  private createSearchForm() {
    this.filtersVal.forEach(key => {
      this.filterControls[key] = new FormControl('');
    });
  }

  createFilter(): (data: any, filter: string) => boolean {
    
    let filterFunction = function (data: any, filter: any): boolean {
      console.log(filter)
      let searchTerms = JSON.parse(filter);
      
      return (data.orderNo == null? 0: data.orderNo).toString().toLowerCase().indexOf(searchTerms.orderNo.toLowerCase())  !== -1
      && (data.bidNo == null? 0:data.bidNo).toString().toLowerCase().indexOf(searchTerms.bidNo.toLowerCase()) !== -1
      && (data.bidName == null? 0: data.bidName).toString().toLowerCase().indexOf(searchTerms.bidName.toLowerCase()) !== -1
      && (data.bidOverTarget ? "Yes": "No").toLowerCase().indexOf((searchTerms.bidOverTarget.toLowerCase())) !== -1
      // && data.bidReceivedDate.toString().toLowerCase().indexOf(searchTerms.bidReceivedDate.toLowerCase()) !== -1
      && (data.bidExternalOrInternal == null? "": data.bidExternalOrInternal).toLowerCase().indexOf(searchTerms.bidExternalOrInternal.toLowerCase())  !== -1
      && (data.bidSkillSet == null? "": data.bidSkillSet).toString().toLowerCase().indexOf(searchTerms.bidSkillSet.toLowerCase()) !== -1
      && (data.bidPoNumber == null? "": data.bidPoNumber).toLowerCase().indexOf(searchTerms.bidPoNumber.toLowerCase()) !== -1
      && (data.bidStatus == null? "":data.bidStatus).toLowerCase().indexOf(searchTerms.bidStatus.toLowerCase()) !== -1
      &&((searchTerms.bidReceivedDate.start !== null && searchTerms.bidReceivedDate.end !== null)
        ? (() => {
            console.log(searchTerms)
            let start = new Date(searchTerms.bidReceivedDate.start.substring(0, 10));
            start.setDate(start.getDate()+1);
            let end = new Date(searchTerms.bidReceivedDate.end.substring(0, 10));
            end.setDate(end.getDate()+1);
            let itemDate = new Date(data.bidReceivedDate.substring(0, 10));
            return itemDate >= start && itemDate <= end;
          })()
        : true)
    }

    return filterFunction;
  }

  createGlobalFilter(): (data: any, filter: string) => boolean {
    
    let filterFunction = function (data: any, filter: any): boolean {
      // console.log(filter)
      let searchTerms = JSON.parse(filter);
      //console.log(searchTerms)
      
      return(data.bidNo == null? 0:data.bidNo).toString().toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
      || (data.bidName == null? 0: data.bidName).toString().toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
      || (data.bidOverTarget ? "Yes": "No").toLowerCase().indexOf((searchTerms.globalSearch.toLowerCase())) !== -1
      || data.bidReceivedDate.toString().toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
      || (data.bidExternalOrInternal == null? "": data.bidExternalOrInternal).toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase())  !== -1
      || (data.bidSkillSet == null? "": data.bidSkillSet).toString().toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
      || (data.bidPoNumber == null? "": data.bidPoNumber).toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
      || (data.bidStatus == null? "":data.bidStatus).toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1 
      
    }

    return filterFunction;
  }

  applyFilter2(column: string) {
    const filterValue = this.filterValues[column].trim().toLowerCase();
    this.filterValues[column] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  
  onDrawerOpened(){
    this.editBidinfoComponent.triggerWhenMatdrweropend()
  }

  getAllBidInfo() {
    this.isLoading = true
    this.bidInfoService.getAllBidInfo(this.isChecked).subscribe((bidInfoData) => {
      this.bidInfoData = bidInfoData;
      this.dataSource.data = this.bidInfoData;
      setTimeout(() => this.dataSource.paginator = this.paginator, 10);
      setTimeout(() => this.dataSource.sort = this.sort, 10);
      this.isLoading = false
    });
  }
  edit(data: any) {
    this.bidInfoService.getBidInfoDetails().next(data);
    this.isMatDrawerOpend = true;
    this.matdrawer.toggle();
  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    if(filterValue != ""){
      this.dataSource.filterPredicate = this.createGlobalFilter()
    }else{
      this.dataSource.filterPredicate = this.createFilter()
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  


  toggleChanged(event: MatSlideToggleChange) {
    this.isChecked = event.checked;
    this.getAllBidInfo();
  }

  updateInterviewDetailsForBid(interviewData, i, bidNo) {

    this.bidInfoData.forEach(eachBid => {
      if (eachBid.bidNo === bidNo) {
        eachBid.interviews[i] = interviewData
      }
    });

  }

  createInterviewDetailsForBid(interviewData, bidNo) {
    this.bidInfoData.forEach(eachBid => {
      if (eachBid.bidNo === bidNo) {

        eachBid.interviews.push(interviewData)
      }
    });

  }

  filterFormConfig(){
    this.filterControls["orderNumberFilter"].valueChanges
      .subscribe(
        ordNumber => {
          this.filterValues.orderNo = ordNumber;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

      this.filterControls["bidNumberFilter"].valueChanges
      .subscribe(
        bidNo => {
          this.filterValues.bidNo = bidNo;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

    this.filterControls["profileSubmittedFilter"].valueChanges
      .subscribe(
        bidName => {
          this.filterValues.bidName = bidName;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

    // this.bidRcvdDateFilter.valueChanges 
    //   .subscribe(
    //     bidReceivedDate => {
    //       this.filterValues.bidReceivedDate = bidReceivedDate;
    //       this.dataSource.filter = JSON.stringify(this.filterValues);
    //     }
    //   )
      this.range.valueChanges.subscribe(range => {
        this.filterValues.bidReceivedDate = { start: range.startFilterControl, end: range.endFilterControl };
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
      );

    this.filterControls["overTargetFilter"].valueChanges
      .subscribe(
        bidOverTarget => {
          this.filterValues.bidOverTarget = bidOverTarget;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

    this.filterControls["externalOrInternalFilter"].valueChanges
      .subscribe(
        bidExternalOrInternal => {
          this.filterValues.bidExternalOrInternal = bidExternalOrInternal;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

    this.filterControls["skillSetFilter"].valueChanges
      .subscribe(
        bidSkillSet => {
          this.filterValues.bidSkillSet = bidSkillSet;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

    this.filterControls["poNumberFilter"].valueChanges
      .subscribe(
        bidPoNumber => {
          this.filterValues.bidPoNumber = bidPoNumber;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

    this.filterControls["bidStatusFilter"].valueChanges
      .subscribe(
        bidStatus => {
          this.filterValues.bidStatus = bidStatus;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

      this.wildSearchFilter.valueChanges
      .subscribe(
        globalSearch => {
          this.wildCardFilterValues.globalSearch = globalSearch
          this.dataSource.filter = JSON.stringify(this.wildCardFilterValues);
        }
      )

  }

  onBack(){
    this.location.back();
  }

}
