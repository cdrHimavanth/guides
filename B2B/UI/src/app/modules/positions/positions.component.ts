import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PositionService } from "./positions-services/position.service";
import { DetailsComponent } from "./details/details.component";
import { SharedService } from "app/shared/shared.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { FilterValues } from "app/shared/shared.data";
import {Location} from "@angular/common"
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {

  parse: {
  
  dateInput: 'MMM DD, YYYY',
  
  },
  
  display: {
  
  dateInput: 'MMM DD, YYYY',
  
  monthYearLabel: 'MMM YYYY',
  
  dateA11yLabel: 'LL',
  
  monthYearA11yLabel: 'MMM YYYY'
  
  },
  
  };

@Component({
  selector: "app-positions",
  templateUrl: "./positions.component.html",
  styleUrls: ["./positions.component.scss"],
  providers: [

    {
    
    provide: DateAdapter,
    
    useClass: MomentDateAdapter,
    
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    
    },
    
     
    
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
    
    ]
})
export class PositionsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "orderNo",
    "positionNos",
    "noOfPositions",
    "recruiter",
    "broadcastDate",
    "stratification",
    "targetRate",
    "skillGroup",
    "preferredSkills",
    "skillRequired",
    "jobDescription",
    "didCustomerReachedOut",
    "probability",
    "submittedAboveTarget",
    "regionName",
    "orderType",
    "lineOfBusiness",
    "productLineName",
    "ll2Manager",
    "ll3Manager",
    "ll4Manager",
    "ll5Manager",
    "ll6Manager",
  ];
  positionsData: any;
  isMatDrawerOpend: boolean = false;
  isChecked = true; // for heading
  dataSource = new MatTableDataSource();
  searchTerm: any = ""; // search input
  defaultFilterPredicate = this.dataSource.filterPredicate;
  isLoading = false;
  currentDate = new Date();
  sourcingFilterStatus: boolean = false;
  isHoveredBackBtn = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatDrawer) matDrawer: MatDrawer;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSlideToggle) toggle: MatSlideToggle;
  @ViewChild(DetailsComponent) detailsComponent: DetailsComponent;
  constructor(
    private positionsService: PositionService,
    private shared: SharedService,
    private location : Location
  ) {
    this.dataSource.filterPredicate = this.createFilter();
  }

  filtersVal = [
    "orderNumberFilter",
    "positionNosFilter",
    "noOfPositionsFilter",
    "recruiterFilter",
    "broadcastDateFilter",
    "stratificationFilter",
    "targetRateFilter",
    "skillGroupFilter",
    "primarySkillFilter",
    "skillSetFilter",
    "jobDescriptionFilter",
    "custReachedOutFilter",
    "probabilityFilter",
    "submAboveTargetFilter",
    "regionFilter",
    "orderTypeFilter",
    "lineOfBusinessFilter",
    "productLineFilter",
    "ll2Filter",
    "ll3Filter",
    "ll4Filter",
    "ll5Filter",
    "ll6Filter",
  ];

  orderNumberFilter = new FormControl("");
  positionNosFilter = new FormControl("");
  noOfPositionsFilter = new FormControl("");
  recruiterFilter = new FormControl("");
  broadcastDateFilter = new FormControl("");
  stratificationFilter = new FormControl("");
  targetRateFilter = new FormControl("");
  skillGroupFilter = new FormControl("");
  primarySkillFilter = new FormControl("");
  skillSetFilter = new FormControl("");
  jobDescriptionFilter = new FormControl("");
  custReachedOutFilter = new FormControl("");
  probabilityFilter = new FormControl("");
  submAboveTargetFilter = new FormControl("");
  regionFilter = new FormControl("");
  orderTypeFilter = new FormControl("");
  lineOfBusinessFilter = new FormControl("");
  productLineFilter = new FormControl("");
  ll2Filter = new FormControl("");
  ll3Filter = new FormControl("");
  ll4Filter = new FormControl("");
  ll5Filter = new FormControl("");
  ll6Filter = new FormControl("");
  startFilterControl = new FormControl();
  endFilterControl = new FormControl();

  filterValues = {
    orderNo: "",
    positionNos: "",
    noOfPositions: "",
    recruiter: "",
    broadcastDate: { start: null, end: null },
    stratification: "",
    targetRate: "",
    skillGroup: "",
    preferredSkills: "",
    skillRequired: "",
    jobDescription: "",
    didCustomerReachedOut: "",
    probability: "",
    submittedAboveTarget: "",
    regionName: "",
    orderType: "",
    lineOfBusiness: "",
    productLineName: "",
    ll2Manager: "",
    ll3Manager: "",
    ll4Manager: "",
    ll5Manager: "",
    ll6Manager: "",
  };
  filterControls: { [key: string]: FormControl } = {};
  range = new FormGroup({
    startFilterControl: this.startFilterControl,
    endFilterControl: this.endFilterControl,
  });

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit() {
    this.shared.closedOpenToggleSubject.subscribe({
      next: (data: any) => {
        this.isChecked = data;
      }
    })

  this.shared.sourcingFilterSubject.subscribe({
    next: (data:any) => {
      this.sourcingFilterStatus = data.sourcingFilterOn;
      if(data.sourcingFilterOn){
        this.getAllOpenPositionsBasedOnSourcing(data.souricngOrders)
        this.createSearchForm();
        this.filterFormConfig();
      }else {
        this.isChecked ? this.getAllOpenPositions() : this.getAllClosedPositions();
        this.createSearchForm();
        this.filterFormConfig();
        this.initializeFilter();

    }
      
    }
  })
  }
    
  initializeFilter(){
     this.shared.positionfilterValuesSubject.subscribe({
      next:(a:FilterValues)=>{
        this.filterControls["skillGroupFilter"].patchValue(a.skillGroup)
        this.filterControls["regionFilter"].patchValue(a.regionName)
        this.filterControls["orderTypeFilter"].patchValue(a.orderType)
        this.filterControls["lineOfBusinessFilter"].patchValue(a.buName)
        this.filterControls["ll2Filter"].patchValue(a.ll2Manager)
        this.filterControls["ll3Filter"].patchValue(a.ll3Manager)
        this.filterControls["ll4Filter"].patchValue(a.ll4Manager)
        this.filterControls["ll5Filter"].patchValue(a.ll5Manager)
        this.filterControls["ll6Filter"].patchValue(a.ll6Manager)
        if (a.date != null) {
          this.range.patchValue({
            startFilterControl: a.date.start,
            endFilterControl: a.date.end,
          });
        }
      },
    });
  }

  private createSearchForm() {
    this.filtersVal.forEach((key) => {
      this.filterControls[key] = new FormControl("");
    });
  }


  calledInTheEnd() {
    let b;
    let sourcingReset;
    this.shared.positionfilterValuesSubject.subscribe({
      next:(a:FilterValues)=>{
        a.date=null;
        a.skillGroup="";
        a.regionName="";
        a.orderType="";
        a.buName="";
        a.ll2Manager="";
        a.ll3Manager="";
        a.ll4Manager="";
        a.ll5Manager="";
        a.ll6Manager="";
        b=a;
      }
    })

    this.shared.sourcingFilterSubject.subscribe({
      next:(data: any)=> {
        data.sourcingFilterOn = false;
        data.sourcingToggle=true;
        data.souricngOrders=[];
        sourcingReset = data
      }
    })
    
    this.shared.positionfilterValuesSubject.next(b);
    this.shared.sourcingFilterSubject.next(sourcingReset);
  }
  ngOnDestroy(): void {
    this.calledInTheEnd();
  }

  onDrawerOpened() {
    this.detailsComponent.triggerWhenMatdrweropend();
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data: any, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
      return (
        (data.orderNo == null ? 0 : data.orderNo)
          .toString()
          .toLowerCase()
          .indexOf(searchTerms.orderNo.toLowerCase()) !== -1 &&
        (data.positionNos == null ? 0 : data.positionNos)
          .toString()
          .toLowerCase()
          .indexOf(searchTerms.positionNos.toLowerCase()) !== -1 &&
        (data.noOfPositions == null ? 0 : data.noOfPositions)
          .toString()
          .toLowerCase()
          .indexOf(searchTerms.noOfPositions.toLowerCase()) !== -1 &&
        (data.recruiter == null ? "" : data.recruiter)
          .toLowerCase()
          .indexOf(searchTerms.recruiter.toLowerCase()) !== -1 &&
        (data.stratification == null ? "" : data.stratification)
          .toLowerCase()
          .indexOf(searchTerms.stratification.toLowerCase()) !== -1 &&
        (data.targetRate == null ? "" : data.targetRate)
          .toString()
          .toLowerCase()
          .indexOf(searchTerms.targetRate.toLowerCase()) !== -1 &&
        (data.skillGroup == null || data.skillGroup == undefined
          ? ""
          : data.skillGroup
        )
          .toLowerCase()
          .indexOf(searchTerms.skillGroup.toLowerCase()) !== -1 &&
        (data.preferredSkills == null ? "" : data.preferredSkills)
          .toLowerCase()
          .indexOf(searchTerms.preferredSkills.toLowerCase()) !== -1 &&
        (data.skillRequired == null ? "" : data.skillRequired)
          .toLowerCase()
          .indexOf(searchTerms.skillRequired.toLowerCase()) !== -1 &&
        (data.jobDescription == null ? "" : data.jobDescription)
          .toLowerCase()
          .indexOf(searchTerms.jobDescription.toLowerCase()) !== -1 &&
        (data.didCustomerReachedOut ? "Yes" : "No")
          .toLowerCase()
          .indexOf(searchTerms.didCustomerReachedOut.toLowerCase()) !== -1 &&
        (data.probability == null ? 0 : data.probability)
          .toString()
          .toLowerCase()
          .indexOf(searchTerms.probability.toLowerCase()) !== -1 &&
        (data.submittedAboveTarget ? "Yes" : "No")
          .toLowerCase()
          .indexOf(searchTerms.submittedAboveTarget.toLowerCase()) !== -1 &&
        (data.regionName == null ? "" : data.regionName)
          .toLowerCase()
          .indexOf(searchTerms.regionName.toLowerCase()) !== -1 &&
        (data.orderType == null ? "" : data.orderType)
          .toLowerCase()
          .indexOf(searchTerms.orderType.toLowerCase()) !== -1 &&
        (data.buName == null ? "" : data.buName)
          .toLowerCase()
          .indexOf(searchTerms.lineOfBusiness.toLowerCase()) !== -1 &&
        (data.productLineName == null ? "" : data.productLineName)
          .toLowerCase()
          .indexOf(searchTerms.productLineName.toLowerCase()) !== -1 &&
        (data.ll2Manager == null ? "" : data.ll2Manager)
          .toLowerCase()
          .indexOf(searchTerms.ll2Manager.toLowerCase()) !== -1 &&
        (data.ll3Manager == null ? "" : data.ll3Manager)
          .toLowerCase()
          .indexOf(searchTerms.ll3Manager.toLowerCase()) !== -1 &&
        (data.ll4Manager == null ? "" : data.ll4Manager)
          .toLowerCase()
          .indexOf(searchTerms.ll4Manager.toLowerCase()) !== -1 &&
        (data.ll5Manager == null ? "" : data.ll5Manager)
          .toLowerCase()
          .indexOf(searchTerms.ll5Manager.toLowerCase()) !== -1 &&
        (data.ll6Manager == null ? "" : data.ll6Manager)
          .toLowerCase()
          .indexOf(searchTerms.ll6Manager.toLowerCase()) !== -1 &&
        (searchTerms.broadcastDate.start !== null &&
        searchTerms.broadcastDate.end !== null
          ? (() => {
              let startString = moment(searchTerms.broadcastDate.start).format("YYYY-MM-DD");
              let endString =moment(searchTerms.broadcastDate.end).format("YYYY-MM-DD");
              let itemDateString = moment(data.broadcastDate).format("YYYY-MM-DD");
              return itemDateString >= startString && itemDateString <= endString;
            })()
          : true)
      );
    };
    return filterFunction;
  }

  
  
  getAllOpenPositionsBasedOnSourcing(sourcingOrders:any) {
    this.positionsService.getAllSourcingPositionDetails(sourcingOrders).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        setTimeout(() => (this.dataSource.sort = this.sort), 10);
        setTimeout(() => (this.dataSource.paginator = this.paginator), 10);
        this.isLoading = true;
      },
      complete: () => {},
      error: (err) => {
        console.error(err);
      },
    });
  }

  

  getAllOpenPositions() {
    this.positionsService.getAllOpenPositionDetails().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        setTimeout(() => (this.dataSource.sort = this.sort), 10);
        setTimeout(() => (this.dataSource.paginator = this.paginator), 10);
        this.isLoading = true;
      },
      complete: () => {},
      error: (err) => {
        console.error(err);
      },
    });
  }

  getAllClosedPositions() {
    this.positionsService.getAllClosedPositionDetails().subscribe({
      next: (data: any) => {
        
        this.dataSource.data = data;
        setTimeout(() => (this.dataSource.sort = this.sort), 10);
        setTimeout(() => (this.dataSource.paginator = this.paginator), 10);
        this.isLoading = true;
      },
      complete: () => {},
      error: (err) => {
        console.error(err);
      },
    });
  }
  toggleChanged() {
    this.isChecked = !this.isChecked;
    this.isChecked ? this.getAllOpenPositions() : this.getAllClosedPositions();
  }

  // getDetails - to open mat drawer and send details of that row to Drawer
  getDetails(rowData: any) {
    this.isMatDrawerOpend = true;
    this.positionsService.getPositionDetails().next(rowData);
    this.matDrawer.toggle();
  }
  matDrawerClose() {
    this.matDrawer.close();
  }

  filterFormConfig() {
    this.filterControls["orderNumberFilter"].valueChanges.subscribe(
      (ordNumber) => {
        this.filterValues.orderNo = ordNumber;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["positionNosFilter"].valueChanges.subscribe(
      (positionNumbers) => {
        this.filterValues.positionNos = positionNumbers;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["noOfPositionsFilter"].valueChanges.subscribe(
      (noOfPos) => {
        this.filterValues.noOfPositions = noOfPos;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["recruiterFilter"].valueChanges.subscribe(
      (recruiter) => {
        this.filterValues.recruiter = recruiter;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["broadcastDateFilter"].valueChanges.subscribe(
      (broadcastDate) => {
        this.filterValues.broadcastDate = broadcastDate;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );
    this.range.valueChanges.subscribe((range) => {
      this.filterValues.broadcastDate = {
        start: range.startFilterControl,
        end: range.endFilterControl,
      };
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.filterControls["stratificationFilter"].valueChanges.subscribe(
      (stratification) => {
        this.filterValues.stratification = stratification;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["targetRateFilter"].valueChanges.subscribe(
      (targetRate) => {
        this.filterValues.targetRate = targetRate;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["skillGroupFilter"].valueChanges.subscribe(
      (skillGroup) => {
        this.filterValues.skillGroup = skillGroup;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["primarySkillFilter"].valueChanges.subscribe(
      (preferredSkills) => {
        this.filterValues.preferredSkills = preferredSkills;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["skillSetFilter"].valueChanges.subscribe(
      (skillRequired) => {
        this.filterValues.skillRequired = skillRequired;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["jobDescriptionFilter"].valueChanges.subscribe(
      (jobDescription) => {
        this.filterValues.jobDescription = jobDescription;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );
    this.filterControls["custReachedOutFilter"].valueChanges.subscribe(
      (didCustomerReachedOut) => {
        this.filterValues.didCustomerReachedOut = didCustomerReachedOut;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["probabilityFilter"].valueChanges.subscribe(
      (probability) => {
        this.filterValues.probability = probability;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["submAboveTargetFilter"].valueChanges.subscribe(
      (submittedAboveTarget) => {
        this.filterValues.submittedAboveTarget = submittedAboveTarget;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["regionFilter"].valueChanges.subscribe((regionName) => {
      this.filterValues.regionName = regionName;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.filterControls["orderTypeFilter"].valueChanges.subscribe(
      (orderType) => {
        this.filterValues.orderType = orderType;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["lineOfBusinessFilter"].valueChanges.subscribe(
      (lineOfBusiness) => {
        this.filterValues.lineOfBusiness = lineOfBusiness;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["productLineFilter"].valueChanges.subscribe(
      (productLineName) => {
        this.filterValues.productLineName = productLineName;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["orderNumberFilter"].valueChanges.subscribe(
      (ordNumber) => {
        this.filterValues.orderNo = ordNumber;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );

    this.filterControls["ll2Filter"].valueChanges.subscribe((ll2Manager) => {
      this.filterValues.ll2Manager = ll2Manager;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.filterControls["ll3Filter"].valueChanges.subscribe((ll3Manager) => {
      this.filterValues.ll3Manager = ll3Manager;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.filterControls["ll4Filter"].valueChanges.subscribe((ll4Manager) => {
      this.filterValues.ll4Manager = ll4Manager;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.filterControls["ll5Filter"].valueChanges.subscribe((ll5Manager) => {
      this.filterValues.ll5Manager = ll5Manager;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.filterControls["ll6Filter"].valueChanges.subscribe((ll6Manager) => {
      this.filterValues.ll6Manager = ll6Manager;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

  onBack(){
    this.location.back();
  }
}
