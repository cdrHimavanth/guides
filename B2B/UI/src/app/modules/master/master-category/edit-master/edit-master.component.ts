import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { B2bAlertMessageService } from "app/shared/b2b-alert-message.service";
import { MasterCategoryComponent } from "../master-category.component";
import { MasterService } from "../../master.service";
import { Apollo } from "apollo-angular";
import { GET_MASTER_DATA } from "app/gqloperations/getQueries.operations";
import { Master } from "app/shared/shared.data";
import { UPDATE_MASTER } from "app/gqloperations/updateMutations.operations";
import { from, map } from "rxjs";
import { ADD_MASTER } from "app/gqloperations/addMutations.operation";


@Component({
  selector: "app-edit-master",
  templateUrl: "./edit-master.component.html",
  styleUrls: ["./edit-master.component.scss"],
})
export class EditMasterComponent  {
  masterEditDetails: any;
  masterList: any[]=[]

  isEditable = false;
  masterCategory: String
  masterNamesList:FormArray
  existingValue;
  lastAddedRowIndex: number;

  performingAction: string = "";

  editMasterDetailsForm: FormGroup = this.fb.group({
    masterNamesList:new FormArray([])
  })
  displayedColumns = ["masterName", "action"]

  dataSource = new MatTableDataSource<any>();

  constructor(
    private masterCategoryRef: MasterCategoryComponent,
    private fb: FormBuilder,
    private alertService:B2bAlertMessageService,
    private masterService: MasterService,
    private apollo: Apollo
  ) {
  }


  triggerWhenMatdrweropend(): void {
    this.masterService
    .getEditMasterDetails()
    .subscribe(data =>{
      this.masterCategory = data
      this.getMasterList(data)
    })
    
  }

  getMasterList(category:any){
    return this.apollo
    .watchQuery({
      query:GET_MASTER_DATA,
      variables: {
        categoryName: category,
      },
      fetchPolicy: 'no-cache'
    }).valueChanges.subscribe((data:any) => {
      this.masterList = data.data.getMasterData
      this.editMasterDetailsForm = this.fb.group({
      masterNamesList:new FormArray(this.getMasterNameFormArray()),
    })
    this.dataSource = new MatTableDataSource((this.editMasterDetailsForm.get('masterNamesList') as FormArray).controls)
    })
  }

  getMasterNameFormArray(){
    return this.masterList.map( data =>{
      
      return this.fb.group({
        masterName:data.masterName,
        isEditable:new FormControl(true),
        action:"existingRecord",
      })
    })
  }

  addNewMasterName(){
    const formControls = this.editMasterDetailsForm.get('masterNamesList') as FormArray;
    formControls.insert(0,this.fb.group({
        masterName:"",
        isEditable:new FormControl(false),
        action:"existingRecord",
    }));
    this.lastAddedRowIndex = this.editMasterDetailsForm.value.masterNamesList.length - 1;
    this.dataSource = new MatTableDataSource(formControls.controls)
    this.performingAction = "adding"
  }

  removerow(editMasterDetailsForm,i){
    const formControls = this.editMasterDetailsForm.get('masterNamesList') as FormArray;
    formControls.removeAt(i);
    if (i === this.lastAddedRowIndex) {
      this.lastAddedRowIndex = -1; // Reset the lastAddedRowIndex
    }
    this.dataSource = new MatTableDataSource(formControls.controls)
  }

  updateMasterNameFormArray(){
    this.editMasterDetailsForm = this.fb.group({
      masterNamesList:new FormArray(this.getMasterNameFormArray()),
    })
    this.dataSource = new MatTableDataSource((this.editMasterDetailsForm.get('masterNamesList') as FormArray).controls)
  }

  editMasterDetails(editMasterDetailsForm, i) {
    editMasterDetailsForm.get('masterNamesList').at(i).get('isEditable').patchValue(false);
    this.existingValue = editMasterDetailsForm.get('masterNamesList').at(i).value.masterName
  }


  closeDrawer() {
    this.masterCategoryRef.firstDrawer.close();
    this.isEditable = false;
    this.masterCategoryRef.isMatDrawerOpend = false
    // this.editMasterDetailsForm.controls['masterName'].setValue('');
  }

  saveEditMasterDetails(editMasterDetailsForm, i) {
    const changedMasterDetails = editMasterDetailsForm.get('masterNamesList').at(i).value
    let changedData = {
      masterName:changedMasterDetails.masterName
    }
    if(this.performingAction == "adding"){
      if(changedData.masterName){
        this.apollo.client.mutate({
          mutation:ADD_MASTER,
          variables: {
            masterInput:{
              masterCategory:this.masterCategory,
              masterName:changedData.masterName
            }
          },
          fetchPolicy: 'no-cache'
        })
          this.alertService.showSuccess("master deatils added successfully.")
          editMasterDetailsForm.get('masterNamesList').at(i).get('isEditable').patchValue(true);
          this.performingAction = null
      }
    } else {
      if(changedData.masterName){
        this.apollo.client.mutate({
          mutation:UPDATE_MASTER,
          variables: {
            masterUpdateInput:{
              existingMasterName:this.existingValue,
              updatedMasterName:changedData.masterName
            }
          },
          fetchPolicy: 'no-cache'
        })
          this.alertService.showSuccess("master deatils updated successfully.")
          editMasterDetailsForm.get('masterNamesList').at(i).get('isEditable').patchValue(true);
          this.performingAction = null
      } else if(this.existingValue == changedData.masterName){
        this.alertService.showSuccess("Business Unit updated successfully.");
        editMasterDetailsForm
          .get("productLinesList")
          .at(i)
          .get("isEditable")
          .patchValue(true);
          this.performingAction = null
      }
      else {
        this.alertService.showError("Please enter a value")
      }
    }
    
     
    
  }

  
  changeDisplayMode() {
    this.isEditable = !this.isEditable;
    this.editMasterDetailsForm.controls['masterName'].setValue(this.masterEditDetails.masterName);
   }
    

}
