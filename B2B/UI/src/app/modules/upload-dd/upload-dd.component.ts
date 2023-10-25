import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { Location } from '@angular/common';

@Component({
  selector: 'app-upload-dd',
  templateUrl: './upload-dd.component.html',
  styleUrls: ['./upload-dd.component.scss']
})
export class UploadDdComponent implements OnInit {

  selectFilter = new UntypedFormControl('positionUpload')
  filterValues = {
    selectedValue: '',
  };   
  
  isHoveredBackBtn = false;

  constructor(private location : Location){

  }

  ngOnInit(): void {  
    this.selectFilter.valueChanges
    .subscribe(
      value => {
        this.filterValues.selectedValue = value;
      }
    ) 
  }

  goBack(): void {
    this.location.back();
  }
}
