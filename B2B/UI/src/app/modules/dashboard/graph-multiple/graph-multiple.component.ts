import { Component, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexStroke,
  ApexGrid,
} from "ng-apexcharts";
import { DashboardService } from "../dashboard-service";

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
  grid: ApexGrid;
};

interface GraphResponseDto {
  startDate: Date;
  lastDate: Date;
  data: any[];
}

@Component({
  selector: "app-graph-multiple",
  templateUrl: "./graph-multiple.component.html",
  styleUrls: ["./graph-multiple.component.scss"],
})
export class GraphMultipleComponent {
  data = [];

  show = "orders";
  toggle = "open";
  display="";

  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public activeOptionButton = "1M";
  public updateOptionsData = {
    "1W": {
      xaxis: {
        min: new Date("19 Feb 2013").getTime(),
        max: new Date("27 Feb 2013").getTime(),
      },
    },
    "1M": {
      xaxis: {
        min: new Date("27 Sep 2012").getTime(),
        max: new Date("27 Feb 2013").getTime(),
      },
    },
    "3M": {
      xaxis: {
        min: new Date("27 Feb 2012").getTime(),
        max: new Date("27 Feb 2013").getTime(),
      },
    },
    "6M": {
      xaxis: {
        min: new Date("01 Jan 2013").getTime(),
        max: new Date("27 Feb 2013").getTime(),
      },
    },
    "1Y": {
      xaxis: {
        min: undefined,
        max: undefined,
      },
    },
  };

  constructor(private dashboardService: DashboardService) {
    this.initChart();
  }

  extractFromCallData(response: GraphResponseDto) {
    const minDate = new Date(response.startDate).getTime();
    const maxDate = new Date(response.lastDate).getTime();
    if (this.activeOptionButton == "3M") {
      this.chartOptions.xaxis = {
        type: "category",
        categories: ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"],
      };
      const chartData = response.data.map((item) => item.count);
      this.chartOptions.series = [
        {
          name: `${this.toggle.toUpperCase()} ${this.show.toUpperCase()}`,
          data: chartData as any,
        },
      ];
      this.chart.updateOptions(this.chartOptions, false, true, true);
    } else if (this.activeOptionButton == "1Y") {
      this.chartOptions.xaxis = {
        type: "datetime",
        min: minDate,
        max: maxDate,
      };
      this.chartOptions.tooltip = {
        x: {
          format: "MMM yyyy",
        },
      };
      this.chart.updateOptions(this.chartOptions, false, true, true);
      const chartData = response.data.map((item) => [
        new Date(item.date).getTime(),
        item.count,
      ]);
      this.chartOptions.series = [
        {
          name: `${this.toggle.toUpperCase()} ${this.show.toUpperCase()}`,
          data: chartData as any,
        },
      ];
      this.chart.updateOptions(this.chartOptions, false, true, true);
    }else if(this.activeOptionButton == "1M") {
      this.chartOptions.xaxis = {
        type: "datetime",
        min: minDate,
        max: maxDate,
        labels:{
          formatter: function(value, timestamp, opts) {
            // Convert the timestamp to a date object
            const date = new Date(timestamp);
            // Format the date to show only the day
            return date.getDate().toString().padStart(2, '0');
          },
        },
        tickAmount: 31,
      };
      this.chartOptions.tooltip = {
        x: {
          formatter: function(value) {
            const date = new Date(value);
            return date.getDate().toString().padStart(2, '0') + ' ' + date.toLocaleString('default', { month: 'short' });  // Format tooltip as 'dd MMM'
          },
        },
      };
      const chartData = response.data.map((item) => [
        new Date(item.date).getTime(),
        item.count,
      ]);
      this.chartOptions.series = [
        {
          name: `${this.toggle.toUpperCase()} ${this.show.toUpperCase()}`,
          data: chartData as any,
        },
      ];
      this.chart.updateOptions(this.chartOptions, false, true, true);
      const date = new Date();  // Current date
      const monthNumber = date.getMonth();  // monthNumber will be 0 (January) to 11 (December)
      const monthName = date.toLocaleString('default', { month: 'long' });  // monthName will be "January" to "December"
      this.display=monthName;
    }else {
      this.chartOptions.xaxis = {
        type: "datetime",
        min: minDate,
        max: maxDate,
      };
      this.chartOptions.tooltip = {
        x: {
          format: "dd MMM yyyy",
        },
      };
      const chartData = response.data.map((item) => [
        new Date(item.date).getTime(),
        item.count,
      ]);
      this.chartOptions.series = [
        {
          name: `${this.toggle.toUpperCase()} ${this.show.toUpperCase()}`,
          data: chartData as any,
        },
      ];
      this.chart.updateOptions(this.chartOptions, false, true, true);
    }
  }

  callTheData() {
    this.dashboardService
      .getGraphData(this.activeOptionButton, this.show, this.toggle)
      .subscribe({
        next: (response: GraphResponseDto) => {
          this.extractFromCallData(response);
        },
      });
  }

  initChart(): void {
    this.chartOptions = {
      series: [
        {
          name: `${this.toggle} ${this.show}`,
          data: this.data as any,
        },
      ],
      chart: {
        type: "area",
        height: 350,
      },
      stroke: {
        colors: ["#2f3a4c"],
      },
      annotations: {
        yaxis: [],
        xaxis: [],
      },
      dataLabels: {
        enabled: true,
        formatter: (val, opts) => {
          return val.toString();
        },
        offsetX: 0,
        offsetY: -10,
        style: {
          colors: ['#2f3a4c']  
        },
        background: {
          enabled: false,
          foreColor: '#fff',
          padding: 4,
          borderRadius: 2,
          borderColor: '#fff',
        }
      },
      markers: {
        size: 1,
      },
      xaxis: {
        type: "datetime",
        min: new Date("01 Mar 2012").getTime(),
        tickAmount: 31,
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#1e293b", "#0a0f1a"],
          shadeIntensity: 1,
          type: "vertical",
          opacityFrom: 0.8,
          opacityTo: 0,
          stops: [0, 100],
        },
      },
    };
    this.callTheData();
  }

  public updateOptions(option: any): void {
    this.activeOptionButton = option;
    this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
    this.callTheData();
    this.callTheData();
  }
  updateChartOption(option: string) {
    this.show = option;
    this.callTheData();
    this.callTheData();
  }
  updateChartToggle(option: string) {
    this.toggle = option;
    this.callTheData();
    this.callTheData();
  }
}
