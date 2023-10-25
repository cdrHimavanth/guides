import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, OnInit} from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { HrreportsService } from "./hrreports.service";
import {Location} from "@angular/common"


@Component({
  selector: "app-hrreports",
  templateUrl: "./hrreports.component.html",
  styleUrls: ["./hrreports.component.scss"],
})
export class HrreportsComponent implements OnInit, AfterViewInit {
  recruiterFilter = new UntypedFormControl("RecruiterDetails");

 
  ngAfterViewInit(): void {}

  ngOnInit(): void {}
  isHoveredBackBtn = false;

  constructor(private http: HttpClient,private hrReportsService: HrreportsService, private location : Location){

  }

  onBack(){
    this.location.back();
  }
}
