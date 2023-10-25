import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { B2bAlertMessageService } from "app/shared/b2b-alert-message.service";
import { BidinfoComponent } from "../bidinfo.component";
import { BidinfoService } from "../services/bidinfo.service";
import { DatePipe } from "@angular/common";


@Component({
  selector: "app-edit-bidinfo",
  templateUrl: "./edit-bidinfo.component.html",
  styleUrls: ["./edit-bidinfo.component.scss"],
})
export class EditBidinfoComponent  {
  bidInfoDetails: any;

  isEditable = false;

  bidInfoEditDetailsForm: FormGroup;
  displayedColumns: string[] ;

  dataSource = new MatTableDataSource<any>();
  interviewDates:FormArray

  constructor(
    private bidInfoService: BidinfoService,
    private bidInfoComponentRef: BidinfoComponent,
    private fb: FormBuilder,
    private alertService:B2bAlertMessageService,
    private datePipe : DatePipe
  ) {
    this.bidInfoEditDetailsForm = this.fb.group({
      interviewDates: new FormArray(this.getInterviewsFormArray([])),
      overTarget: null,
      bidRate:null,
      poNumber:null,
      bidExternalOrInternal:null,
      bidSkillSet:null
    })
  }

  

  
  triggerWhenMatdrweropend(): void {
    this.displayedColumns = this.bidInfoComponentRef.isChecked ? ["interviewDate", "interviewResult", "action"]:["interviewDate", "interviewResult"]

    this.bidInfoService
    .getBidInfoDetails()
    .subscribe(data =>{
      this.bidInfoDetails = data
      
      this.bidInfoService.getInterviews(this.bidInfoDetails.bidNo).subscribe(interviewData => {
        
        this.bidInfoEditDetailsForm = this.fb.group({
          interviewDates: new FormArray(this.getInterviewsFormArray(interviewData)),
          overTarget: this.bidInfoDetails.bidOverTarget ?this.bidInfoDetails.bidOverTarget.toString() :null,
          bidRate: this.bidInfoDetails.bidRate,
          poNumber:this.bidInfoDetails.bidPoNumber,
          bidExternalOrInternal:this.bidInfoDetails.bidExternalOrInternal,
          bidSkillSet:this.bidInfoDetails.bidSkillSet
        })

        this.dataSource = new MatTableDataSource((this.bidInfoEditDetailsForm.get('interviewDates') as FormArray).controls)
      })
  
      
      
    })
    
  }

  getInterviewsFormArray(interviewData){
   
    return interviewData.map( data =>{
      return this.fb.group({
        interviewId:data.interviewId,
        isEditable:new FormControl(true),
        action:"existingRecord",
        interviewResult:data.interviewResult != null ? data.interviewResult :"",
        interviewDate :data.interviewDate != null ? data.interviewDate:""
      })
    })
  }

  scheduleInterviewDate(){
    const formControls = this.bidInfoEditDetailsForm.get('interviewDates') as FormArray;
    formControls.insert(0,this.fb.group({
      interviewId:null,
      isEditable:new FormControl(false),
      action:"existingRecord",
      interviewResult: "",
      interviewDate :""
    }));
    this.dataSource = new MatTableDataSource(formControls.controls)
    
  }

  editInterviewDate(bidInfoEditDetailsForm, i) {
    bidInfoEditDetailsForm.get('interviewDates').at(i).get('isEditable').patchValue(false);
  }

  removeInterviewDate(i) {
    const formControls = this.bidInfoEditDetailsForm.get('interviewDates') as FormArray;
    formControls.removeAt(i)
    this.dataSource = new MatTableDataSource(formControls.controls)
  }
  saveInterviewDate(bidInfoEditDetailsForm, i) {
    
    const interviewDeatils = bidInfoEditDetailsForm.get('interviewDates').at(i).value
    let interviewData = {
      interviewId:interviewDeatils.interviewId,
      interviewDate:interviewDeatils.interviewDate,
      interviewResult:interviewDeatils.interviewResult
    }

    if(interviewData.interviewId){
      
      this.bidInfoService.updateInterview(interviewData).subscribe((data)=>{
        this.alertService.showSuccess("Interview deatils updated successfully.")
        bidInfoEditDetailsForm.get('interviewDates').at(i).get('isEditable').patchValue(true);
        
      })
    }else{
      
      interviewData['bidNo'] = this.bidInfoDetails.bidNo

      this.bidInfoService.createInterview(interviewData).subscribe((data)=>{
        
        if(data.data === null ){
            this.alertService.showError(data.message)
        }
        else {
         
          bidInfoEditDetailsForm.get('interviewDates').at(i).get('isEditable').patchValue(true)
          this.alertService.showSuccess("Interview deatils created successfully.")
          bidInfoEditDetailsForm.get('interviewDates').at(i).get('interviewId').patchValue(data.interviewId);
         
        }
        
      })
    }
    
  }


  closeDrawer() {
    this.bidInfoComponentRef.matdrawer.close();
    this.isEditable = false;
    this.bidInfoComponentRef.isMatDrawerOpend = false
  }


  saveBidInfoDetails() {
    const bidInfoData = {
     
      bidNo:this.bidInfoDetails.bidNo,
      bidOverTarget:this.bidInfoEditDetailsForm.value.overTarget,
      bidRate: this.bidInfoEditDetailsForm.value.bidRate,
      bidPoNumber:this.bidInfoEditDetailsForm.value.poNumber,
      bidExternalOrInternal:this.bidInfoEditDetailsForm.value.bidExternalOrInternal,
      bidSkillSet:this.bidInfoEditDetailsForm.value.bidSkillSet

    }
    
    if(bidInfoData.bidRate > 0 || bidInfoData.bidRate == null){
      this.bidInfoService.updateBidInfo(bidInfoData).subscribe((data)=>{
        this.bidInfoDetails = data
        this.alertService.showSuccess("BidInfo deatils update successfully.")
        this.changeDisplayMode()
        this.bidInfoComponentRef.getAllBidInfo()
      })
    }
    else{
      this.alertService.showError("Enter valid bid rate, it should be non negative.")
    }
  }
  formattedInterviewDate: String;
  
  changeDisplayMode() {
    this.isEditable = !this.isEditable;
   }
   transformDate(date: string): string {
    const transformedDate = this.datePipe.transform(date, 'MMM dd, yyyy hh:mm a');
    return transformedDate ? transformedDate : '';
  }
  


}
