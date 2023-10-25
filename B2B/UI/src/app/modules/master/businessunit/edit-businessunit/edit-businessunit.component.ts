import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { B2bAlertMessageService } from "app/shared/b2b-alert-message.service";
import { BusinessUnitComponent } from "../businessunit.component";
import { BusinessUnitService } from "../businessunit.service";
import { Apollo } from "apollo-angular";
import { GET_PRODUCT_LINE } from "app/gqloperations/getQueries.operations";
import { ADD_PRODUCT_LINE } from "app/gqloperations/addMutations.operation";
import { UPDATE_PRODUCT_LINE } from "app/gqloperations/updateMutations.operations";

@Component({
  selector: "app-edit-businessunit",
  templateUrl: "./edit-businessunit.component.html",
  styleUrls: ["./edit-businessunit.component.scss"],
})
export class EditBusinessUnitComponent {
  editBusinessUnitDetails: any;
  businessUnitName: any;

  productLineList: [] = [];
  existingPLName:string="";

  isEditable = false;

  productLinesList: FormArray;
  lastAddedRowIndex: number;

  editBusinessUnitDetailsForm: FormGroup = this.fb.group({
    productLinesList: new FormArray([]),
  });

  displayedColumns = ["productLineName", "action"];

  dataSource = new MatTableDataSource<any>();
  performingAction: string = "";

  constructor(
    private businessUnitComponentRef: BusinessUnitComponent,
    private fb: FormBuilder,
    private alertService: B2bAlertMessageService,
    private managerService: BusinessUnitService,
    private apollo: Apollo
  ) {}

  triggerWhenMatdrweropend(): void {
    this.managerService.getEditBusinessUnitDetails().subscribe((data) => {
      this.editBusinessUnitDetails = data;
      this.businessUnitName = data.businessUnitName;
      this.apollo
        .watchQuery({
          query: GET_PRODUCT_LINE,
          variables: { buName: this.businessUnitName },
          fetchPolicy: 'no-cache'
        })
        .valueChanges.subscribe((data: any) => {
          console.log(data.data);
          this.productLineList = data.data.getProductList;
          this.editBusinessUnitDetailsForm = this.fb.group({
            productLinesList: new FormArray(this.getProductLineFormArray()),
          });
          this.dataSource = new MatTableDataSource(
            (
              this.editBusinessUnitDetailsForm.get(
                "productLinesList"
              ) as FormArray
            ).controls
          );
        });
    });
  }

  getProductLineFormArray() {
    return this.productLineList.map((data: any) => {
      return this.fb.group({
        productLineName: data.productLineName,
        isEditable: new FormControl(true),
        action: "existingRecord",
      });
    });
  }

  addProductLine() {
    const formControls = this.editBusinessUnitDetailsForm.get(
      "productLinesList"
    ) as FormArray;
    formControls.insert(
      0,
      this.fb.group({
        productLineName: "",
        isEditable: new FormControl(false),
        action: "existingRecord",
      })
    );
    this.dataSource = new MatTableDataSource(formControls.controls);
    
    this.performingAction = "adding";
  }

  editBUDetails(editBusinessUnitDetailsForm, i) {
    this.existingPLName =editBusinessUnitDetailsForm.get('productLinesList').value[i].productLineName
    editBusinessUnitDetailsForm
      .get("productLinesList")
      .at(i)
      .get("isEditable")
      .patchValue(false);
  }

  closeDrawer() {
    this.businessUnitComponentRef.firstDrawer.close();
    this.isEditable = false;
    this.businessUnitComponentRef.isMatDrawerOpend = false;
  }

  saveBusinessUnitDetails(editBusinessUnitDetailsForm, i) {
    const changedBUDetails = editBusinessUnitDetailsForm
      .get("productLinesList")
      .at(i).value;
    const changedPLname = changedBUDetails.productLineName
    let changedData = {
      chnageProdLine: changedBUDetails.productLineName,
    };

    if(this.performingAction == "adding"){
    if(changedData.chnageProdLine){
      console.log("adding PL")
      console.log(changedData)
      this.apollo.client.mutate({
        mutation:ADD_PRODUCT_LINE,
        variables:{
          addProductLineDto:{
            buName : this.businessUnitName,
            productLineName: changedBUDetails.productLineName
          }
        },
        fetchPolicy: 'no-cache'
      })
      this.alertService.showSuccess("Business Unit updated successfully.");
      editBusinessUnitDetailsForm
        .get("productLinesList")
        .at(i)
        .get("isEditable")
        .patchValue(true);
        this.performingAction = null
    }
  } else {
    if(changedData.chnageProdLine) {
      console.log("updating PL")
      console.log(changedData);
      this.apollo.client.mutate({
        mutation:UPDATE_PRODUCT_LINE,
        variables:{
          updateProductLineDto:{
            buName : this.businessUnitName,
            existingProductLineName: this.existingPLName,
            updatedProductLineName: changedBUDetails.productLineName
          }
        },
        fetchPolicy: 'no-cache'
      })
      this.alertService.showSuccess("Business Unit updated successfully.");
      editBusinessUnitDetailsForm
        .get("productLinesList")
        .at(i)
        .get("isEditable")
        .patchValue(true);
        this.performingAction = null
    }
    else if(this.existingPLName == changedPLname){
      this.alertService.showSuccess("Business Unit updated successfully.");
      editBusinessUnitDetailsForm
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

  getPreviousPL(editBusinessUnitDetailsForm, i){
    console.log(this.existingPLName, i)
    editBusinessUnitDetailsForm.get('productLinesList').value[i].productLineName = this.existingPLName 
  }

  removerow(editMasterDetailsForm, i) {
    const formControls = this.editBusinessUnitDetailsForm.get(
      "productLinesList"
    ) as FormArray;
    formControls.removeAt(i);
    this.dataSource = new MatTableDataSource(formControls.controls);
  }

  changeDisplayMode() {
    this.isEditable = !this.isEditable;
    this.resetForm();
  }

  resetForm() {
    this.editBusinessUnitDetailsForm.controls["businessUnitName"].setValue(
      this.editBusinessUnitDetails.businessUnitName
    );
  }
}
