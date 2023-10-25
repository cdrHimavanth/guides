import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { B2bAlertMessageService } from "app/shared/b2b-alert-message.service";
import { BusinessUnitComponent } from "../businessunit.component";
import { Apollo } from "apollo-angular";
import { ADD_BUSINESS_UNIT } from "app/gqloperations/addMutations.operation";



@Component({
  selector: "app-add-businessunit",
  templateUrl: "./add-businessunit.component.html",
  styleUrls: ["./add-businessunit.component.scss"],
})
export class AddBusinessUnitComponent  {

  addBusinessUnitForm: FormGroup = this.fb.group({
    businessUnitName: [''],
  });

  constructor(
    private businessunitComponentRef: BusinessUnitComponent,
    private fb: FormBuilder,
    private alertService:B2bAlertMessageService,
    private apollo:Apollo
  ) {}

  triggerWhenMatdrweropend(): void {
    // this.showScreen = 'businessunit'
      console.log("add businessunit opened !!!!!")
  }

  closeDrawer() {
    this.businessunitComponentRef.secondDrawer.close();
    this.businessunitComponentRef.isMatDrawerOpend = false
    this.resetForm()
  }

  AddBusinessUnit() {
    const newBuName = this.addBusinessUnitForm.value.businessUnitName
    this.apollo.client.mutate({
      mutation:ADD_BUSINESS_UNIT,
      variables:{
        businessUnitDto:{
          buName : newBuName
        }
      },
      fetchPolicy: 'no-cache'
    })
    this.alertService.showSuccess("Business Unit added successfully.")

    this.closeDrawer()
    this.resetForm()

  }

  resetForm(){
    this.addBusinessUnitForm.controls['businessUnitName'].setValue('');
   }

}
