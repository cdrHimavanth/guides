import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { B2bAlertMessageService } from "app/shared/b2b-alert-message.service";
import { ManagerComponent } from "../manager.component";
import { ManagerService } from "../manager.service";
import { Apollo } from "apollo-angular";
import { UPDATE_MANAGER } from "app/gqloperations/updateMutations.operations";
import { GET_MANAGERS_BY_LL2, GET_MANAGERS_BY_LL3, GET_MANAGERS_BY_LL4, GET_MANAGERS_BY_LL5 } from "app/gqloperations/getQueries.operations";



@Component({
  selector: "app-edit-manager",
  templateUrl: "./edit-manager.component.html",
  styleUrls: ["./edit-manager.component.scss"],
})
export class EditManagerComponent {
  managerEditDetails: any;

  ll5Managers = [];
  ll4Managers = [];
  ll3Managers = [];
  ll2Managers = [];


  isEditable = false;
  existingLl6Manager;

  managerEditDetailsForm: FormGroup = this.fb.group({
    ll6Manager: [''],
    ll5Manager: [''],
    ll4Manager: [''],
    ll3Manager: [''],
    ll2Manager: [''],

  });
  displayedColumns = ["ll6Manager", "ll5Manager", "ll4Manager", "ll3Manager", "ll2Manager"]

  dataSource = new MatTableDataSource<any>();

  constructor(
    private managerComponentRef: ManagerComponent,
    private fb: FormBuilder,
    private alertService:B2bAlertMessageService,
    private managerService: ManagerService,
    private apollo: Apollo

  ) {
  }

  ngOnInit() {
    // Fetch data using Apollo Client
    this.apollo
      .watchQuery<any>({
        query: GET_MANAGERS_BY_LL5,
      })
      .valueChanges.subscribe(({ data }) => {
        // Extract the managers array from the response data
        this.ll5Managers = data.getManagersByLl5Role;
      });
    this.apollo
      .watchQuery<any>({
        query: GET_MANAGERS_BY_LL4,
      })
      .valueChanges.subscribe(({ data }) => {
        // Extract the managers array from the response data
        this.ll4Managers = data.getManagersByLl4Role;
      });
    this.apollo
      .watchQuery<any>({
        query: GET_MANAGERS_BY_LL3,
      })
      .valueChanges.subscribe(({ data }) => {
        // Extract the managers array from the response data
        this.ll3Managers = data.getManagersByLl3Role;
      });
    this.apollo
      .watchQuery<any>({
        query: GET_MANAGERS_BY_LL2,
      })
      .valueChanges.subscribe(({ data }) => {
        // Extract the managers array from the response data
        this.ll2Managers = data.getManagersByLl2Role;
      });
  }

  triggerWhenMatdrweropend(): void {
    this.managerService
    .getEditManagerDetails()
    .subscribe(data =>{
      this.managerEditDetails = data

        this.managerEditDetailsForm = this.fb.group({
          ll6Manager: this.managerEditDetails.ll6Manager,
          ll5Manager: this.managerEditDetails.ll5Manager,
          ll4Manager: this.managerEditDetails.ll4Manager,
          ll3Manager: this.managerEditDetails.ll3Manager,
          ll2Manager: this.managerEditDetails.ll2Manager,
        })

        // this.dataSource = new MatTableDataSource((this.bidInfoEditDetailsForm.get('interviewDates') as FormArray).controls)

      })

  }



  closeDrawer() {
    this.managerComponentRef.firstDrawer.close();
    this.isEditable = false;
    this.managerComponentRef.isMatDrawerOpend = false
    
  }


  saveEditManagerDetails() {

    const managerDto1 = {
      ll2Manager: this.managerEditDetailsForm.value.ll2Manager,
      ll3Manager: this.managerEditDetailsForm.value.ll3Manager,
      ll4Manager: this.managerEditDetailsForm.value.ll4Manager,
      ll5Manager: this.managerEditDetailsForm.value.ll5Manager,
      ll6Manager: this.managerEditDetailsForm.value.ll6Manager,
      existingLl6Manager: this.existingLl6Manager,
    }
    console.log(managerDto1)

    this.apollo.client.mutate({
      mutation: UPDATE_MANAGER,
      variables: {
        updateManagerDto: {
          ll2Manager: this.managerEditDetailsForm.value.ll2Manager,
          ll3Manager: this.managerEditDetailsForm.value.ll3Manager,
          ll4Manager: this.managerEditDetailsForm.value.ll4Manager,
          ll5Manager: this.managerEditDetailsForm.value.ll5Manager,
          ll6Manager: this.managerEditDetailsForm.value.ll6Manager,
          existingLl6Manager: this.existingLl6Manager,
        }
      },
      fetchPolicy: 'no-cache'
    })

    console.log(this.managerEditDetails)
    this.alertService.showSuccess("Manager details updated successfully.")
    this.isEditable = !this.isEditable;
    this.resetForm()
    
  }

  getExistingLL6() {
    this.existingLl6Manager = this.managerEditDetailsForm.controls['ll6Manager'].value
    console.log(this.existingLl6Manager)
  }
  
  changeDisplayMode() {
    this.isEditable = !this.isEditable;
    this.resetForm()
  }

  resetForm() {
    this.managerEditDetailsForm.controls['ll6Manager'].setValue(this.managerEditDetails.ll6Manager);
    this.managerEditDetailsForm.controls['ll5Manager'].setValue(this.managerEditDetails.ll5Manager);
    this.managerEditDetailsForm.controls['ll4Manager'].setValue(this.managerEditDetails.ll4Manager);
    this.managerEditDetailsForm.controls['ll3Manager'].setValue(this.managerEditDetails.ll3Manager);
    this.managerEditDetailsForm.controls['ll2Manager'].setValue(this.managerEditDetails.ll2Manager);
  }


}
