import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';







export interface AttemptedPositions {
  bidName: string;
  noOfPositions: string;
  positionData: number[];


}
/** Constants used to fill up our data base. */
const BIDNAME: string[] = [
  "Bid1",
  "Bid2",
  "Bid3",
  "Bid4",
  "Bid5",
  "Bid6",
  "Bid7",
  "Bid8",
  "Bid9",
  "Bid10",

];

const NOOFOSITIONS: string[] = ['4', '4', '3', '4', '3', '2', '1', '2', '1', '2'];

const POSITIONNUMBERS: any[][] = [
  [{ position: 20474, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 30225, interviewResult: "Shortlisted", declinedReason: "His skillset is more around support than active development" },
  { position: 40125, interviewResult: "Feedback Pending", declinedReason: "His skillset is more around support than active development" },
  { position: 25698, interviewResult: "Tech Reject", declinedReason: "His skillset is more around support than active development" },
  { position: 20574, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" }
  ],

  [{ position: 20474, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 30225, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 40125, interviewResult: "Shortlisted", declinedReason: "His skillset is more around support than active development" },
  { position: 25698, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  ],

  [{ position: 20474, interviewResult: "Tech Reject", declinedReason: "His skillset is more around support than active development" },
  { position: 30225, interviewResult: "Shortlisted", declinedReason: "His skillset is more around support than active development" },
  { position: 40125, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  
  ],

  [{ position: 20474, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 30225, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 40125, interviewResult: "Feedback Pending", declinedReason: "His skillset is more around support than active development" },
  { position: 25698, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 20574, interviewResult: "Tech Reject", declinedReason: "His skillset is more around support than active development" }
  ],

  [{ position: 20474, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 30225, interviewResult: "Shortlisted", declinedReason: "His skillset is more around support than active development" },
  { position: 40125, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 25698, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 20574, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" }
  ],

  [{ position: 20474, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 30225, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 40125, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 25698, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 20574, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" }
  ],

  [{ position: 20474, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 30225, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 40125, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 25698, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" },
  { position: 20574, interviewResult: "Interview Cancelled", declinedReason: "His skillset is more around support than active development" }
  ],

];




@Component({
  selector: 'app-attempted-positions-info',
  templateUrl: './attempted-positions-info.component.html',
  styleUrls: ['./attempted-positions-info.component.scss']
})
export class AttemptedPositionsInfoComponent implements OnInit {

  displayedColumns: string[] = ['bidName', 'noOfPositions'];
  dataSource: MatTableDataSource<AttemptedPositions>;

  panelOpenState = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  // bidNameFilter = new UntypedFormControl('');
  // overallFilter = new UntypedFormControl('');
  searchControl = new FormControl("");

  // filterValues = {
  //   bidName: '',
  //   overallFilter: '',
  // };


  applyFilter() {
    const filterValue = this.searchControl.value.toLowerCase();

    this.dataSource.filter = filterValue.trim();
  }

  constructor() {

    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    const atmptPositions = BIDNAME.map((on, index) => createNewUser(index))
    //  console.log(actvbids)

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(atmptPositions);
    // this.dataSource.filterPredicate = this.createFilter();

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    // this.bidNameFilter.valueChanges
    //   .subscribe(
    //     bidNamefil => {
    //       this.filterValues.bidName = bidNamefil;
    //       this.dataSource.filter = JSON.stringify(this.filterValues);
    //     }
    //   )



    // this.overallFilter.valueChanges
    //   .subscribe(
    //     changedValue => {
    //       this.filterValues.overallFilter = changedValue;
    //       this.dataSource.filter = JSON.stringify(this.filterValues);
    //     }
    //   )
  }


  // createFilter(): (data: any, filter: string) => boolean {
  //   let filterFunction = function (data: any, filter: any): boolean {
  //     let searchTerms = JSON.parse(filter);
  //     console.log(searchTerms)
  //     return data.bidName.toLowerCase().indexOf(searchTerms.bidName.toLowerCase()) !== -1

  //       && (
  //         data.bidName.toString().indexOf(searchTerms.overallFilter.toLowerCase()) !== -1
  //       )
  //   }

  //   return filterFunction;
  // }
  setStyles(interviewResult : string){
    if(interviewResult === "Interview Cancelled"){
      return "{color : 'yellow'}";
    }
    else if(interviewResult === "Shortlisted"){
      return "{color : 'green'}";
    }
    else if(interviewResult === "Tech Reject"){
      return "{color : 'red'}";
    }
    else if(interviewResult === "Feedback Pending"){
      return "{color : 'orange'}";
    }
    console.log("function called------------")
  }

}

/** Builds and returns a new User. */
function createNewUser(index: number): AttemptedPositions {




  const bdName = BIDNAME[index];
  const noOfPositions2 = NOOFOSITIONS[index];
  const positionNumberArray = POSITIONNUMBERS[index];

  return {
    bidName: bdName,
    noOfPositions: noOfPositions2,
    positionData: positionNumberArray
  };




}


