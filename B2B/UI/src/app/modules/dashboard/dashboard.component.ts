import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard-service';
import { Router } from '@angular/router';
import { PositionsComponent } from '../positions/positions.component';
import { SharedService } from 'app/shared/shared.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { BidFilterValues, BroadcastDate, FilterValues, SourcingFilter } from 'app/shared/shared.data';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};


const openJobsData: any = [];

const orderTypesByRegionHeaders : any = [];

const orderTypesByBuHeaders : any = [];

const openJobsRegionData = [];

const bussinessUnitData: any = [];

const openJobsSkillGroupData: any = [];





interface Manager {
  value: string;
  viewValue: string;
}





/**
 * @title Binding event handlers and properties to the table rows.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  positionsData: any;
  orderTypesByRegionHeaders: any;
  orderTypeByBuHeaders: any;
  openJobsDataSource = openJobsData;
  openJobsRegionDataSource = openJobsRegionData;
  openJobsSkillGroupDataSource = openJobsSkillGroupData;
  bussinessUnitDataSource = bussinessUnitData;
  openJobsByManagerOrgDataSource;
  openPositionsSummaryDatasource;
  closedPositionsSummaryDatasource;
  openBidSummaryDatasource;
  closedBidSummaryDatasource;
  condition: boolean = false;
  openPositionsCount = 0;
  currentDate: Date;
  todayOrderCount = 0;
  openAndClosedOrdersCount = {
    openOrders: 0,
    closedOrders: 0
  };

  openPositonByMonthChartData = [];
  closedPositionByMonthChartData = [];
  activeMonthsInChart = [];

  isDataLoaded: boolean = false;

  currentManagerData = [];

  // Bid Graph options
  showBidXAxis = true;
  showBidYAxis = true;
  bidGradient = false;
  bidShowLegend = true;
  bidShowXAxisLabel = true;
  bidShowYAxisLabel = true;
  bidYAxisLabel = 'Number Of Bids';

  // Position Graph options
  showPositionXAxis = true;
  showPositionYAxis = true;
  positionGradient = false;
  positionShowLegend = true;
  positionShowXAxisLabel = true;
  positionShowYAxisLabel = true;
  positionYAxisLabel = 'Number Of Positions';






  graphView: any[] = [450, 300];
  cardView: any[] = [190, 150];

  managers: Manager[] = [
    { value: 'LL2', viewValue: 'LL2' },
    { value: 'LL3', viewValue: 'LL3' },
    { value: 'LL4', viewValue: 'LL4' },
    { value: 'LL5', viewValue: 'LL5' },
    { value: 'LL6', viewValue: 'LL6' },
  ];

  managerSelect = "LL2";

  colorScheme = {
    domain: ['#0c4a6e', '#60a5fa']
  };
  cardColorScheme = {
    domain: ['#60a5fa', '#0c4a6e', '#7aa3e5', '#032c9e', '#60a5fa', '#0c4a6e']
  }
  cardColor: string = '#232837';

  bidGraphData = [];
  positionsGraphData = [];
  numberCardData = [];

  bidLegendLabels: string[] = ['Open Bids', 'Closed Bids'];
  positionLegendLabels: string[] = ['Open Positions', 'Closed Positions'];

  constructor(private dashboardService: DashboardService, private router: Router, private positionRef: PositionsComponent, private shared: SharedService, 
   ) {

    this.chartOptions = {
      series: [
        {
          name: "Open Positions",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: "#0c4a6e"
        },
        {
          name: "Closed Positions",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: "#60a5fa"
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
        labels: {
          rotate: -45
        }
      },
      tooltip: {
        x: {
          show: false
        }
      },
    };

    Object.assign(this.bidGraphData);
    Object.assign(this.numberCardData)


  }

  async ngOnInit() {
    this.currentDate = new Date();
    try {
      this.positionsData = await this.dashboardService.getPositionsData();
      this.orderTypesByRegionHeaders = await this.dashboardService.getOrderTypeByRegion();
      this.orderTypeByBuHeaders = await this.dashboardService.getOrderTypeByBu();
      this.orderTypesByRegionHeaders = this.orderTypesByRegionHeaders.sort()
      this.orderTypeByBuHeaders = this.orderTypeByBuHeaders.sort()
      
      const openPositionsSummaryData = this.positionsData.openPositionsSummaryData;
      const closedPositionsSummaryData = this.positionsData.closedPositionsSummaryData;
      const openPositonByMonthChartDataResponse = this.positionsData.openPositionsByMonthData;
      const closedPositonByMonthChartDataResponse = this.positionsData.closedPositionsByMonthData;


      if (openPositionsSummaryData !== undefined && closedPositionsSummaryData !== undefined && openPositionsSummaryData.allOpenPositions !== undefined && openPositionsSummaryData.totalActiveBids !== undefined
        && openPositionsSummaryData.sourcing !== undefined && openPositionsSummaryData.notSourcing !== undefined
        && openPositionsSummaryData.today !== undefined && openPositionsSummaryData.thisWeek !== undefined
        && openPositionsSummaryData.thisMonth !== undefined && openPositionsSummaryData.previousMonth !== undefined) {
        this.openPositionsSummaryDatasource = openPositionsSummaryData;
        this.openPositionsCount = this.openPositionsSummaryDatasource.allOpenPositions;
        this.closedPositionsSummaryDatasource = closedPositionsSummaryData;
        openPositonByMonthChartDataResponse.map(eachData => {
          this.openPositonByMonthChartData.push(eachData.positionsCount);
          this.activeMonthsInChart.push(eachData.month);
        })
        closedPositonByMonthChartDataResponse.map(eachData => {
          this.closedPositionByMonthChartData.push(eachData.positionsCount);
        })


      }

      if (this.positionsData.positionsByRegionData !== undefined) {
        this.openJobsRegionDataSource = this.positionsData.positionsByRegionData.sort((a, b) => {
          return b.grandTotal - a.grandTotal;
        });
      }

      
      if (this.positionsData.positionsByBUData !== undefined) {
        this.bussinessUnitDataSource = this.positionsData.positionsByBUData.sort((a, b) => {
          return b.grandTotal - a.grandTotal;
        });
      }


      if (this.positionsData.positionBySkillGroupData !== undefined) {
        this.openJobsSkillGroupDataSource = this.positionsData.positionBySkillGroupData.sort((a, b) => {
          return b.sumOFNoOfPositions - a.sumOFNoOfPositions;
        });
      }




      if (this.positionsData.positionByType !== undefined) {
        this.openJobsDataSource = this.positionsData.positionByType.sort((a, b) => {
          return b.noOfPositions - a.noOfPositions;
        });
      }


      const bidSubmissionSummaryDataResult = await this.dashboardService.getBidSubmissionSummary()
      if (bidSubmissionSummaryDataResult !== undefined && bidSubmissionSummaryDataResult.openBidsData.previousMonth !== undefined &&
        bidSubmissionSummaryDataResult.openBidsData.thisMonth !== undefined && bidSubmissionSummaryDataResult.openBidsData.thisWeek !== undefined
        && bidSubmissionSummaryDataResult.openBidsData.today !== undefined) {
        this.openBidSummaryDatasource = bidSubmissionSummaryDataResult.openBidsData;
        this.closedBidSummaryDatasource = bidSubmissionSummaryDataResult.closedBidsData;
      }



      const ordersData = await this.dashboardService.getOrdersData();

      if (ordersData.openAndClosedOrdersCount !== undefined) {
        this.openAndClosedOrdersCount = ordersData.openAndClosedOrdersCount;
      }
      if (ordersData.ordersCountToday !== undefined) {
        this.todayOrderCount = ordersData.ordersCountToday.ordersTodayCount;
      }
      this.openJobsByManagerOrgDataSource = await this.dashboardService.getPositionsByManager();
      if (this.openJobsByManagerOrgDataSource.ll2 !== undefined) {
        this.currentManagerData = this.openJobsByManagerOrgDataSource.ll2;
      }
      if (this.openBidSummaryDatasource !== undefined && this.openBidSummaryDatasource.previousMonth !== undefined
        && this.openBidSummaryDatasource.thisMonth !== undefined && this.openBidSummaryDatasource.thisWeek !== undefined
        && this.openBidSummaryDatasource.today !== undefined && this.openPositionsSummaryDatasource !== undefined
        && this.openPositionsSummaryDatasource.allOpenPositions !== undefined && this.openPositionsSummaryDatasource.totalActiveBids !== undefined
        && this.openAndClosedOrdersCount.openOrders !== undefined && this.openAndClosedOrdersCount.closedOrders !== undefined
      ) {
        this.updateValue();
      }
      this.setPositionChartData();
    }
    catch (error) {
      console.log(error)
    }
  }

  setPositionChartData() {
    this.chartOptions = {
      series: [
        {
          name: "Open Positions",
          data: this.openPositonByMonthChartData,
          color: "#0c4a6e"
        },
        {
          name: "Closed Positions",
          data: this.closedPositionByMonthChartData,
          color: "#60a5fa"
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: this.activeMonthsInChart,
        labels: {
          rotate: -45
        }
      },
      tooltip: {
        x: {
          show: false
        }
      },
    };

  }
  updateValue() {



    this.bidGraphData = [
      {
        //name: 'PREVIOUS MONTH',
        name: 'Previous Month',
        color: '#60a5fa',
        series: [
          {
            name: "Open Bids",
            value: this.openBidSummaryDatasource.previousMonth,
            tooltipText: 'Custom Tooltip 1'
          }, {
            name: "Closed Bids",
            value: this.closedBidSummaryDatasource.previousMonth,
            tooltipText: 'Custom Tooltip 1'
          }
        ],




      },
      {
        //name: 'THIS MONTH',
        name: 'This Month',
        color: '#0c4a6e',
        series: [
          {
            name: "Open Bids",
            value: this.openBidSummaryDatasource.thisMonth,
            tooltipText: 'Custom Tooltip 1'
          },
          {
            name: "Closed Bids",
            value: this.closedBidSummaryDatasource.thisMonth,
            tooltipText: 'Custom Tooltip 1'
          }
        ],


      },
      {
        //name: 'THIS WEEK(MON-FRI)',
        name: 'This Week',
        color: '#032c9e',
        series: [
          {
            name: "Open Bids",
            value: this.openBidSummaryDatasource.thisWeek,
            tooltipText: 'Custom Tooltip 1',

          },
          {
            name: "Closed Bids",
            value: this.closedBidSummaryDatasource.thisWeek,
            tooltipText: 'Custom Tooltip 1'
          }
        ]



      },
      {
        //name: 'Today',
        name: 'Today',
        color: '#1e293c',
        series: [
          {
            name: "Open Bids",
            value: this.openBidSummaryDatasource.today,
            tooltipText: 'Custom Tooltip 1'
          }, {
            name: "Closed Bids",
            value: this.closedBidSummaryDatasource.today,
            tooltipText: 'Custom Tooltip 1'
          }
        ]


      }];


    this.positionsGraphData = [
      {
        //name: 'PREVIOUS MONTH',
        name: 'Previous Month',
        color: '#60a5fa',
        series: [
          {
            name: "Open Positions",
            value: this.openPositionsSummaryDatasource.previousMonth,
            tooltipText: 'Custom Tooltip 1'
          }, {
            name: "Closed Positions",
            value: this.closedPositionsSummaryDatasource.previousMonth,
            tooltipText: 'Custom Tooltip 1'
          }
        ],




      },
      {
        //name: 'THIS MONTH',
        name: 'This Month',
        color: '#0c4a6e',
        series: [
          {
            name: "Open Positions",
            value: this.openPositionsSummaryDatasource.thisMonth,
            tooltipText: 'Custom Tooltip 1'
          },
          {
            name: "Closed Positions",
            value: this.closedPositionsSummaryDatasource.thisMonth,
            tooltipText: 'Custom Tooltip 1'
          }
        ],


      },
      {
        //name: 'THIS WEEK(MON-FRI)',
        name: 'This Week',
        color: '#032c9e',
        series: [
          {
            name: "Open Positions",
            value: this.openPositionsSummaryDatasource.thisWeek,
            tooltipText: 'Custom Tooltip 1',

          },
          {
            name: "Closed Positions",
            value: this.closedPositionsSummaryDatasource.thisWeek,
            tooltipText: 'Custom Tooltip 1'
          }
        ]



      },
      {
        //name: 'Today',
        name: 'Today',
        color: '#1e293c',
        series: [
          {
            name: "Open Positions",
            value: this.openPositionsSummaryDatasource.today,
            tooltipText: 'Custom Tooltip 1'
          }, {
            name: "Closed Positions",
            value: this.closedPositionsSummaryDatasource.today,
            tooltipText: 'Custom Tooltip 1'
          }
        ]


      }];



    this.numberCardData = [
      {
        "name": "Open Orders",
        "value": this.openAndClosedOrdersCount.openOrders
      },
      {
        "name": "Closed Orders",
        "value": this.openAndClosedOrdersCount.closedOrders
      },
      {
        "name": "Open Positions",
        "value": this.openPositionsSummaryDatasource.allOpenPositions
      },
      {
        "name": "Closed Positions",
        "value": this.closedPositionsSummaryDatasource.closedPositionsCount
      },
      {
        "name": "Active Bids",
        "value": this.openPositionsSummaryDatasource.totalActiveBids
      },

      {
        "name": "Closed Bids",
        "value": this.openPositionsSummaryDatasource.totalClosedBids
      },
    ]


  }






  getColorScheme(data: any[]): string[] {
    return data.map(item => item.color);
  }

  getBidLegendColor(type): string {
    // Assign colors based on the data index or any other logic
    const colors = { "Open Bids": '#0c4a6e', "Closed Bids": '#60a5fa' }
    return colors[type];
  }

  getPositionLegendColor(type): string {
    // Assign colors based on the data index or any other logic
    const colors = { "Open Positions": '#0c4a6e', "Closed Positions": '#60a5fa' }
    return colors[type];
  }

  formatYAxisTick(value: number): number {
    return value;
  }

  onSelectManager(manager: string) {
    if (manager === "LL2") {
      this.currentManagerData = this.openJobsByManagerOrgDataSource.ll2;
    }
    if (manager === "LL3") {
      this.currentManagerData = this.openJobsByManagerOrgDataSource.ll3;
    }
    if (manager === "LL4") {
      this.currentManagerData = this.openJobsByManagerOrgDataSource.ll4;
    }
    if (manager === "LL5") {
      this.currentManagerData = this.openJobsByManagerOrgDataSource.ll5;
    }
    if (manager === "LL6") {
      this.currentManagerData = this.openJobsByManagerOrgDataSource.ll6;
    }



  }

  getPositionsWithSkillGroup(skilllGroup: string) {
    this.shared.positionfilterValuesSubject.subscribe({
      next: (a: FilterValues) => {
        a.skillGroup = skilllGroup;
      }
    })
    this.router.navigateByUrl("/positions");
  }

  getManagers(data: any, role: string) {
    let b;
    this.shared.positionfilterValuesSubject.subscribe({
      next: (a: FilterValues) => {
        if (role == "LL2") {
          a.ll2Manager = data.managerColumn
        } else if (role == "LL3") {
          a.ll3Manager = data.managerColumn
        } else if (role == "LL4") {
          a.ll4Manager = data.managerColumn
        } else if (role == "LL5") {
          a.ll5Manager = data.managerColumn
        } else if (role == "LL6") {
          a.ll6Manager = data.managerColumn
        }

        b = a;
      }
    })
    this.shared.positionfilterValuesSubject.next(b);
    this.router.navigateByUrl("/positions");


  }

  getPositions() {
    this.router.navigateByUrl("/positions")
  }

  getToday(redirectPath: string) {
    const today = new Date();
    if (redirectPath === "/positions") {
      let b;
      this.shared.positionfilterValuesSubject.subscribe({
        next: (a: FilterValues) => {
          let date = new BroadcastDate();
          date.start = today.toISOString().substring(0, 10);
          date.end = today.toISOString().substring(0, 10);
          a.date = date
          b = a;
        }
      })
      this.shared.positionfilterValuesSubject.next(b);
    }
    else if (redirectPath === "/bidinfo") {
      let b;
      this.shared.bidfilterValuesSubject.subscribe({
        next: (a: BidFilterValues) => {
          let date = new BroadcastDate();
          date.start = today.toISOString().substring(0, 10);
          date.end = today.toISOString().substring(0, 10);
          a.date = date
          b = a;
        }
      })
      this.shared.bidfilterValuesSubject.next(b);
    }
    this.router.navigateByUrl(redirectPath)
  }
  getThisWeek(redirectPath: string) {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay); // Adjust for the start of the week (Sunday)

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - currentDay)); // Adjust for the end of the week (Saturday)

    let startDate = startOfWeek.toISOString().substring(0, 10);
    let endDate = endOfWeek.toISOString().substring(0, 10);

    if (redirectPath === "/positions") {
      let b;
      this.shared.positionfilterValuesSubject.subscribe({
        next: (a: FilterValues) => {
          let date = new BroadcastDate();
          date.start = startDate;
          date.end = endDate;
          a.date = date
          b = a;
        }
      })
      this.shared.positionfilterValuesSubject.next(b);
    }
    else if (redirectPath === "/bidinfo") {
      let b;
      this.shared.bidfilterValuesSubject.subscribe({
        next: (a: BidFilterValues) => {
          let date = new BroadcastDate();
          date.start = startDate;
          date.end = endDate;
          a.date = date
          b = a;
        }
      })
      this.shared.bidfilterValuesSubject.next(b)
    }

    this.router.navigateByUrl(redirectPath)

  }
  getThisMonth(redirectPath: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfMonth = new Date(year, month, 2);
    const lastDayOfMonth = new Date(year, month + 1, 1);

    let startDate = firstDayOfMonth.toISOString().substring(0, 10);
    let endDate = lastDayOfMonth.toISOString().substring(0, 10);

    if (redirectPath === "/positions") {
      let b;
      this.shared.positionfilterValuesSubject.subscribe({
        next: (a: FilterValues) => {
          let date = new BroadcastDate();
          date.start = startDate;
          date.end = endDate;
          a.date = date
          b = a;
        }
      })
      this.shared.positionfilterValuesSubject.next(b);
    }
    else if (redirectPath === "/bidinfo") {
      let b;
      this.shared.bidfilterValuesSubject.subscribe({
        next: (a: BidFilterValues) => {
          let date = new BroadcastDate();
          date.start = startDate;
          date.end = endDate;
          a.date = date
          b = a;
        }
      })
      this.shared.bidfilterValuesSubject.next(b)
    }


    this.router.navigateByUrl(redirectPath);
  }
  getPreviousMonth(redirectPath: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let previousYear = year;
    let previousMonth = month - 1;

    if (previousMonth < 0) {
      previousYear--;
      previousMonth = 11;
    }

    const firstDayOfPreviousMonth = new Date(previousYear, previousMonth, 2);
    const lastDayOfPreviousMonth = new Date(year, month, 1);

    let startDate = firstDayOfPreviousMonth.toISOString().substring(0, 10);
    let endDate = lastDayOfPreviousMonth.toISOString().substring(0, 10);

    if (redirectPath === "/positions") {
      let b;
      this.shared.positionfilterValuesSubject.subscribe({
        next: (a: FilterValues) => {
          let date = new BroadcastDate();
          date.start = startDate;
          date.end = endDate;
          a.date = date
          b = a;
        }
      })
      this.shared.positionfilterValuesSubject.next(b);
    }
    else if (redirectPath === "/bidinfo") {
      let b;
      this.shared.bidfilterValuesSubject.subscribe({
        next: (a: BidFilterValues) => {
          let date = new BroadcastDate();
          date.start = startDate;
          date.end = endDate;
          a.date = date
          b = a;
        }
      })
      this.shared.bidfilterValuesSubject.next(b)
    }

    this.router.navigateByUrl(redirectPath);
  }

  getOrderType(orderType: string) {
    let b;
    this.shared.positionfilterValuesSubject.subscribe({
      next: (a: FilterValues) => {
        a.orderType = orderType;
        b = a;
      }
    })
    this.shared.positionfilterValuesSubject.next(b);
    this.router.navigateByUrl("/positions")
  }

  getSourcing(sourcing: boolean) {
    let b;
    this.shared.sourcingFilterSubject.subscribe({
      next: (a: SourcingFilter) => {
        a.sourcingFilterOn = true;
        if(sourcing){
          a.souricngOrders = this.openPositionsSummaryDatasource.sourcing
        }else{
          a.souricngOrders = this.openPositionsSummaryDatasource.notSourcing
        }
        b = a;
      }
    })
    this.shared.positionfilterValuesSubject.next(b);
    this.router.navigateByUrl("/positions")
  }
 
  regionByPosition(data:any, orderType: any):void{
    let b;
    this.shared.positionfilterValuesSubject.subscribe({
      next :(a: FilterValues)=>{
        a.regionName=data.region
        a.orderType= orderType
        b=a;
        b = a;
      }
    })
    this.shared.positionfilterValuesSubject.next(b);
    this.router.navigateByUrl("/positions")
  }


  businessUnitPosition(data:any, ordType:any):void{
    let b;
    this.shared.positionfilterValuesSubject.subscribe({
      next :(a: FilterValues)=>{
        a.buName=data.businessUnit
        a.orderType=ordType
        b=a;
      }
    })
    this.shared.positionfilterValuesSubject.next(b);
    this.router.navigateByUrl("/positions")
  }



  getbids() {
    this.router.navigateByUrl("/bidinfo")
  }

  updateClosedOpenToggleSubject(toggle: boolean) {
    this.shared.closedOpenToggleSubject.next(toggle);
  }

  onSelectBidGraph(data): void {
    let name :string = data.name;
    let series : string = data.series;
    if(series === "This Month" ){
      if(name === "Open Bids"){
        this.updateClosedOpenToggleSubject(true);
      }
      else {
        this.updateClosedOpenToggleSubject(false);
      }
      this.getThisMonth("/bidinfo");

    }
    else if (series === "This Week") {

      if (name === "Open Bids") {
        this.updateClosedOpenToggleSubject(true);
      }
      else {
        this.updateClosedOpenToggleSubject(false);
      }
      this.getThisWeek("/bidinfo");
    }
    else if (series === "Previous Month") {
      if (name === "Open Bids") {
        this.updateClosedOpenToggleSubject(true);
      }
      else {
        this.updateClosedOpenToggleSubject(false);
      }
      this.getPreviousMonth("/bidinfo");
    }
    else if (series === "Today") {
      if (name === "Open Bids") {
        this.updateClosedOpenToggleSubject(true);
      }
      else {
        this.updateClosedOpenToggleSubject(false);
      }
      this.getToday("/bidinfo");
    }


  }


  onSelectPositionGraph(data): void {
    let name :string = data.name;
    let series : string = data.series;
    if(series === "This Month" ){
      if(name === "Open Positions"){
        this.updateClosedOpenToggleSubject(true);
      }
      else {
        this.updateClosedOpenToggleSubject(false);
      }
      this.getThisMonth("/positions");

    }
    else if (series === "This Week") {

      if (name === "Open Positions") {
        this.updateClosedOpenToggleSubject(true);
      }
      else {
        this.updateClosedOpenToggleSubject(false);
      }
      this.getThisWeek("/positions");
    }
    else if (series === "Previous Month") {
      if (name === "Open Positions") {
        this.updateClosedOpenToggleSubject(true);
      }
      else {
        this.updateClosedOpenToggleSubject(false);
      }
      this.getPreviousMonth("/positions");
    }
    else if (series === "Today") {
      if (name === "Open Positions") {
        this.shared.bidInfoSearchStringSubject.next("");
        this.updateClosedOpenToggleSubject(true);
      }
      else {
        this.shared.bidInfoSearchStringSubject.next("");
        this.updateClosedOpenToggleSubject(false);
      }
      this.getToday("/positions");
    }


  }



  onSelectNumberCard(event) {
    if (event.name === "Open Orders" || event.name === "Open Positions") {
      this.shared.closedOpenToggleSubject.next(true);
      this.shared.searchStringSubject.next("");
      this.router.navigateByUrl("/positions");
    }
    else if (event.name === "Closed Orders" || event.name === "Closed Positions") {
      this.shared.closedOpenToggleSubject.next(false);
      this.shared.searchStringSubject.next("");
      this.router.navigateByUrl("/positions");
    }
    else if (event.name === "Active Bids") {
      this.shared.closedOpenToggleSubject.next(true);
      this.shared.bidInfoSearchStringSubject.next("");
      this.router.navigateByUrl("/bidinfo");
    }
    else if (event.name === "Closed Bids") {
      this.shared.closedOpenToggleSubject.next(false);
      this.shared.bidInfoSearchStringSubject.next("");
      this.router.navigateByUrl("/bidinfo");
    }
  }

  public generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

}
