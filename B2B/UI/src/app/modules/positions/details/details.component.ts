import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { PositionService } from '../positions-services/position.service';
import { PositionsComponent } from '../positions.component';
import { Apollo } from 'apollo-angular';
import { GET_MASTER_DATA, GET_BUSINESS_UNIT, GET_MANAGERS, GET_LL6_MANAGERS, GET_PRODUCT_LINE } from 'app/gqloperations/getQueries.operations';
import { B2bAlertMessageService } from 'app/shared/b2b-alert-message.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  isEditable = false
  jobDetailsForm: FormGroup;
  expandJd = false
  expandSkillset = false
  positionsDetails // To store position data
  jobDetailsObj
  formData: FormData;
  businessUnitList;
  regioncodeList
  pdfErrorMsg = "";
  productLineList;
  recruiterList;
  orderTypesList
  ll6ManagerList
  managersList
  updatedPositionDetails

  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile: File | null = null;
  selectedFileName: string = '';
  showNewInput: boolean = true;
  positionStatuslocal: boolean = false;
  positionNos = "";
  businessUnitVar: any
  recruiterMailId;
  constructor(
    private positionsService: PositionService,
    private formBuilder: FormBuilder,
    private positionComponentRef: PositionsComponent,
    private alertService: B2bAlertMessageService,
    private apollo: Apollo,) { }

  triggerWhenMatdrweropend(): void {
    this.positionsService
      .getPositionDetails()
      .subscribe(data => {
        if (data) {
          this.positionsDetails = data;
          this.positionNos = this.positionsDetails.positionNos
          this.positionStatuslocal = this.positionsDetails.positionActiveStatus
          this.positionsDetails.skillGroup = this.positionsDetails.skillGroup == 'Unassigned' ? '' : this.positionsDetails.skillGroup
          this.positionsDetails.ll5Manager = this.positionsDetails.ll5Manager == 'Unassigned' ? '' : this.positionsDetails.ll5Manager
          this.positionsDetails.ll4Manager = this.positionsDetails.ll4Manager == 'Unassigned' ? '' : this.positionsDetails.ll4Manager
          this.positionsDetails.ll3Manager = this.positionsDetails.ll3Manager == 'Unassigned' ? '' : this.positionsDetails.ll3Manager
          this.positionsDetails.ll2Manager = this.positionsDetails.ll2Manager == 'Unassigned' ? '' : this.positionsDetails.ll2Manager

        }
      })

    this.positionsService.getAllrecruiters().subscribe(data => {
      this.recruiterList = data;
    })

    // Create the task form
    this.jobDetailsForm = this.formBuilder.group({
      orderNo: [''],
      recruiter: ['', Validators.required],
      skillGroup: ['', Validators.required],
      orderType: [''],
      didCustomerReachedOut: [''],
      probability: [0, [Validators.min(0), Validators.max(100)]],
      submittedAboveTarget: [''],
      regionName: [''],
      buName: [''],
      productLineName: ['',],
      ll6Manager: [''],
      ll5Manager: [''],
      ll4Manager: [''],
      ll3Manager: [''],
      ll2Manager: [''],
    });

    //Master data 
    this.apollo.watchQuery({
      query: GET_MASTER_DATA,
      variables: {
        categoryName: "region",
      },
      fetchPolicy: 'no-cache'
    }).valueChanges.subscribe((data: any) => {
      this.regioncodeList = data.data.getMasterData.filter(item => item.masterName != "Unassigned");
    })

    this.apollo.watchQuery({
      query: GET_MASTER_DATA,
      variables: {
        categoryName: "order type",
      },
      fetchPolicy: 'no-cache'
    }).valueChanges.subscribe((data: any) => {
      this.orderTypesList = data.data.getMasterData.filter(item => item.masterName != "Unassigned");
    })

    this.apollo.watchQuery({
      query: GET_BUSINESS_UNIT,
      fetchPolicy: 'no-cache'
    }).valueChanges.subscribe((data: any) => {
      this.businessUnitList = data.data.getBusinessUnitList.filter(item => item.businessUnitName != "Unassigned");
    })

    this.apollo.watchQuery({
      query: GET_LL6_MANAGERS,
      fetchPolicy: 'no-cache'
    }).valueChanges.subscribe((data: any) => {
      this.ll6ManagerList = data.data.getLL6List.filter(item => item.ll6Manager != "Unassigned");
    })
  }

  getprodcutList(businessUnitVar) {
    this.apollo.watchQuery({
      query: GET_PRODUCT_LINE,
      variables: { buName: businessUnitVar },
      fetchPolicy: 'no-cache'
    }).valueChanges.subscribe((data: any) => {
      this.productLineList = data.data.getProductList.filter(item => item.masterName != "Unassigned");
    })
  }

  closeDrawer() {
    if (this.isEditable) {
      this.isEditable = !this.isEditable;
    }
    this.positionComponentRef.isMatDrawerOpend = false
    this.positionComponentRef.matDrawerClose();
    this.resetFileInput();

  }

  cancelEdit(): Promise<MatDrawerToggleResult> {
    return this.positionComponentRef.matDrawer.close();
  }

  toggleSkillSetText() {
    this.expandSkillset = !this.expandSkillset;
  }
  toggleJDText() {
    this.expandJd = !this.expandJd;
  }

  /*** Toggle edit mode  details*/
  toggleEditMode() {
    this.isEditable = !this.isEditable;
    this.jobDetailsForm = this.formBuilder.group({
      recruiter: this.positionsDetails.recruiter,
      skillGroup: this.positionsDetails.skillGroup,
      orderType: this.positionsDetails.orderType,
      didCustomerReachedOut: this.positionsDetails.didCustomerReachedOut ? "Yes" : "No",
      probability: this.positionsDetails.probability,
      submittedAboveTarget: this.positionsDetails.submittedAboveTarget ? "Yes" : "No",
      regionName: this.positionsDetails.regionName,
      buName: this.positionsDetails.buName,
      productLineName: this.positionsDetails.productLineName,
      ll6Manager: this.positionsDetails.ll6Manager,
      ll5Manager: this.positionsDetails.ll5Manager,
      ll4Manager: this.positionsDetails.ll4Manager,
      ll3Manager: this.positionsDetails.ll3Manager,
      ll2Manager: this.positionsDetails.ll2Manager,
    });
  }
  // Submit Form
  submitDetails() {
    this.jobDetailsObj = {
      orderNo: this.positionsDetails.orderNo,
      broadcastDate: this.positionsDetails.broadcastDate,
      mailId: this.recruiterMailId,
      recruiter: this.jobDetailsForm.get('recruiter').value,
      skillGroup: this.jobDetailsForm.get('skillGroup').value,
      didCustomerReachedOut: this.jobDetailsForm.get('didCustomerReachedOut').value === "Yes" ? true : false,
      probability: this.jobDetailsForm.get('probability').value,
      submittedAboveTarget: this.jobDetailsForm.get('submittedAboveTarget').value === "Yes" ? true : false,
      region: this.jobDetailsForm.get('regionName').value,
      orderType: this.jobDetailsForm.get('orderType').value,
      businessUnit: this.jobDetailsForm.get('buName').value,
      productLine: this.jobDetailsForm.get('productLineName').value,
      manager: this.jobDetailsForm.get('ll6Manager').value
    }
    this.positionsService.updatePositionDetails(this.jobDetailsObj).subscribe({
      next: (data) => {
        console.log(data)
        this.updatedPositionDetails = data
        this.positionsDetails = data
        this.positionsDetails.positionActiveStatus = this.positionStatuslocal
        this.positionsDetails.positionNos = this.positionNos
        if (this.positionsDetails.positionActiveStatus) {
          this.positionComponentRef.getAllOpenPositions()
        }
        else {
          this.positionComponentRef.getAllClosedPositions()
        }
      },
      complete: () => {
        this.alertService.showSuccess("Updated successfully")
      },
      error: (err) => { console.error(err) },
    })
    this.toggleEditMode();
  }

  onDropdownChange() {
    for (let manager of this.ll6ManagerList) {
      if (this.jobDetailsForm.value.ll6Manager === manager.ll6Manager) {
        this.apollo.watchQuery({
          query: GET_MANAGERS,
          variables: { ll6Manager: manager.ll6Manager }
        }).valueChanges.subscribe((data: any) => {
          this.managersList = data.data.getManagerList
          this.jobDetailsForm.get('ll5Manager').setValue(this.managersList.ll5Manager)
          this.jobDetailsForm.get('ll4Manager').setValue(this.managersList.ll4Manager)
          this.jobDetailsForm.get('ll3Manager').setValue(this.managersList.ll3Manager)
          this.jobDetailsForm.get('ll2Manager').setValue(this.managersList.ll2Manager)
        })
        break;
      }
    }
  }

  updateFormDetails() {
    this.positionsService.getPositionDetails().next(this.jobDetailsObj);
  }
  // Cancel Changes
  cancelChanges() {
    this.toggleEditMode();
  }
  onBuChange() {
    // Clear the Product Line dropdown
    this.jobDetailsForm.value.product = '';
    for (let bu of this.businessUnitList) {
      if (this.jobDetailsForm.value.buName === bu.businessUnitName) {
        this.apollo.watchQuery({
          query: GET_PRODUCT_LINE,
          variables: { buName: bu.businessUnitName }
        }).valueChanges.subscribe((data: any) => {
          this.productLineList = data.data.getProductList
        })
        break
      }
    }
  }

  fetchRecruiterMail(recruiter: any) {
    const selectedRecruiter = this.recruiterList.find(val => val.givenName === recruiter);
    this.recruiterMailId = selectedRecruiter.mailId;
  }

  uploadFile(orderNo) {
    if (!this.selectedFile) {
      alert('Please select a PDF file to upload.');
      return;
    }
    else {
      this.positionsService.uploadPositions(this.selectedFile, orderNo).subscribe({
        next: (data: any) => {
          if (data.data === null) {
            if (data.status == "925") {
              this.alertService.showError(data.message);
              this.pdfErrorMsg = "";
            }
            else {
              this.alertService.showError(data.message);
              this.pdfErrorMsg = "";
            }
          }
          else {
            this.pdfErrorMsg = "";
            this.positionComponentRef.getAllOpenPositions();
            this.alertService.showSuccess("File uploaded successfully!");
            this.positionComponentRef.matDrawerClose()
          }

        }
      })
    }


  }

  onFileSelected(event: any) {
    const fileInput = event.target;
    this.pdfErrorMsg = "";
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0] as File;
      this.selectedFileName = this.selectedFile?.name || '';
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
    this.showNewInput = false;
  }

  resetFileInput() {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

}