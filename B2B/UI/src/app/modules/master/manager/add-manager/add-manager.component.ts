import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { B2bAlertMessageService } from "app/shared/b2b-alert-message.service";
import { ManagerComponent } from "../manager.component";
import { Apollo } from "apollo-angular";
import { ADD_MANAGER } from "app/gqloperations/addMutations.operation";
import { GET_LL5_MANAGERS } from "app/gqloperations/getQueries.operations";



@Component({
  selector: "app-add-manager",
  templateUrl: "./add-manager.component.html",
  styleUrls: ["./add-manager.component.scss"],
})
export class AddManagerComponent  implements OnInit{

  ll5ManagerList = []
  ll4ManagerList = []
  ll3ManagerList = []
  ll2ManagerList = []

  addManagerDetailsForm: FormGroup = this.fb.group({
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
    private apollo:Apollo
  ) {}
  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_LL5_MANAGERS,
     
    }).valueChanges.subscribe((data: any) => {
      console.log(data.data.getLL5List);

      this.ll5ManagerList = data.data.getLL5List
      console.log(this.ll5ManagerList)

    })
  }

   
  triggerWhenMatdrweropend(): void {
      console.log("add manager opened !!!!!")
  }



  closeDrawer() {
    this.managerComponentRef.secondDrawer.close();
    this.managerComponentRef.isMatDrawerOpend = false
    this.resetForm()
  }


  AddManager() {
    this.apollo.client.mutate({
      mutation: ADD_MANAGER,
      variables:{
        managerDto:{
          ll2Manager:this.addManagerDetailsForm.value.ll2Manager,
          ll3Manager:this.addManagerDetailsForm.value.ll3Manager,
          ll4Manager:this.addManagerDetailsForm.value.ll4Manager,
          ll5Manager:this.addManagerDetailsForm.value.ll5Manager,
          ll6Manager:this.addManagerDetailsForm.value.ll6Manager,
        }
      },
      fetchPolicy: 'no-cache'
    })
    this.alertService.showSuccess("Manager added successfully.")
    this.closeDrawer()
  }
  

  resetForm(){
    this.addManagerDetailsForm.controls['ll6Manager'].setValue('');
    this.addManagerDetailsForm.controls['ll5Manager'].setValue('');
    this.addManagerDetailsForm.controls['ll4Manager'].setValue('');
    this.addManagerDetailsForm.controls['ll3Manager'].setValue('');
    this.addManagerDetailsForm.controls['ll2Manager'].setValue('');
   }

   onLl5ManagerChange() {
   
    for (let manager of this.ll5ManagerList) {
      if (this.addManagerDetailsForm.value.ll5Manager === manager.ll5Manager) {
      console.log(manager)

          this.addManagerDetailsForm.get('ll4Manager').setValue(manager.ll4Manager)
          this.addManagerDetailsForm.get('ll3Manager').setValue(manager.ll3Manager)
          this.addManagerDetailsForm.get('ll2Manager').setValue(manager.ll2Manager)
        break;

        }
      }
    }
  
  newOption=this.fb.group({
    newOptionValue:['']
   })
   addNewll5() {
   let entry = {
    "ll5Manager":this.newOption.value.newOptionValue
  }
    this.ll5ManagerList.push(entry);
    this.newOption.patchValue({newOptionValue:""})

  }
   
}
