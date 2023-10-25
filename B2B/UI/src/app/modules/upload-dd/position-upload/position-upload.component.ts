import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { UploadDdService } from '../service/upload-dd.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, firstValueFrom, forkJoin, map } from 'rxjs';
import { FileServiceService } from '../service/file/file-service.service';
import { Apollo } from 'apollo-angular';
import { GET_MASTER_DATA } from 'app/gqloperations/getQueries.operations';
import { Router } from '@angular/router';
import { B2bAlertMessageService } from 'app/shared/b2b-alert-message.service';

interface CustomFile extends File{
  errMsg: string
}

@Component({
  selector: 'position-upload',
  templateUrl: './position-upload.component.html',
  styleUrls: ['./position-upload.component.scss']
})

export class PositionUploadComponent {
  ordersData
  isExcelUploadFailed = false
  configErr = false
  dataSource
  MAX_LENGTH = 100.00
  totalFileSize = 0.0
  disableExcelDndDiv: boolean = false; //  to disable drag nd drop after selecting only one excel open position file
  isExcelUploaded: boolean = false; // to check whether the excel is uploaded or not if it is true it hides the excel div and displays pdf div
  showAlertExcel: boolean = false;
  filesList: CustomFile[] = [];
  masterData = []
  notificationFileHeader = []
  displayedColumns: string[] = ['fileName', 'status', 'icon',] // displays table of files with status
  alert: { type: FuseAlertType; message: string } = {
    type: "warning",
    message: "",
  };
 

  constructor(private uploadService: UploadDdService, private apollo: Apollo,
    private alertService:B2bAlertMessageService,
    private fileService: FileServiceService, private router: Router,) {
    console.log(this.filesList.length)
  }

  /** on file drop handler */
  onFileDroppedExcel($event) {
    this.prepareFilesListExcel($event);
  }

  /**  handle file from browsing */
  fileBrowseHandlerExcel(files) {
    this.prepareFilesListExcel(files);
  }

  reset() {
    this.filesList = [];
    this.masterData = []
    this.notificationFileHeader = []
    this.disableExcelDndDiv = false
    this.isExcelUploaded = false;
    this.totalFileSize = 0.0;
    this.showAlertExcel = false;
    this.configErr = false
    this.isExcelUploadFailed = false
    this.dataSource = []
  }

  deleteFileExcel(index: number) {
    this.reset()
  }
  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesListExcel(localFilesList: any) {
    this.showAlertExcel = false;
    for (const file of localFilesList) {
      const allowedTypes = ['xls', 'xlsx', 'xlsm'];
      const fileExtension = file.name.split('.').pop();
      if (!allowedTypes.includes(fileExtension)) {
        this.showErrorAlert("Please upload only excel file with .xlsx /.xls /.xlsm extension")
      }
      else {
        if (file.name.split(".")[0].toLowerCase().includes("position")) {
          this.configFileUpload(file)
            .then(() => {
              // Handle the result or continue with the next steps
            })
            .catch((error) => {
              console.log(error)
            });
          this.disableExcelDndDiv = true;
          this.filesList.push(file);
        }
        else {
          this.showErrorAlert("Please upload file with name position")

        }
      }
    }
  }
  showErrorAlert(message: string): void {
    this.alert = {
      type: "error",
      message: message,
    };
    this.showAlertExcel = true;
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  countFileSize(size) {
    let type, size1;
    this.totalFileSize += size;
    if (this.countTotalFilesSize()) {
      return true;
    }
    else {
      this.countTotalFilesSize();
      [size1, type] = this.formatBytes(this.totalFileSize, 2).split(' ')
      if (size1 > this.MAX_LENGTH && type == "MB") {
        this.totalFileSize -= size;
        this.showErrorAlert("Upload only " + this.MAX_LENGTH + " MB at a time")
      }
    }
  }
  countTotalFilesSize() {
    let type, size1;
    [size1, type] = this.formatBytes(this.totalFileSize, 2).split(' ')
    if (size1 > this.MAX_LENGTH && type == "MB") {
      return false;
    }
    else
      return true;
  }

  excelUpload() {
    this.showAlertExcel = false
    if (this.filesList.length != 0) {
      const uploadObservables: Observable<any>[] = [];
      for (const file of this.filesList) {
        uploadObservables.push(this.uploadFile(file));
      }
      forkJoin(uploadObservables).subscribe((uploadedFiles: any[]) => {
        this.dataSource = new MatTableDataSource<any>();
        this.dataSource.data = uploadedFiles;
        this.isExcelUploaded = true;
        this.filesList = [];
      });
    } else {
      this.showErrorAlert("Upload one excel file with .xlsx/ .xls/ .xlsm extension to continue")
    }
    this.isExcelUploaded = true
  }

  private uploadFile(file: CustomFile): Observable<any> {
    return this.uploadService.uploadNotificationExcel([file]).pipe(
      map((data: any) => {
        if (data.status != "500 INTERNAL_SERVER_ERROR" && data.status != "925") {
        this.alertService.showSuccess("Uploaded successfully")
          this.router.navigate(['/positions']);

          // return { fileName: file.name, status: "Uploaded", icon: "Uploaded" };
        } else if (data.status == "925") {
          this.isExcelUploadFailed = true
          return { fileName: file.name, status: data.message, icon: "Rejected" };
        }
        else {
          this.isExcelUploadFailed = true
          return { fileName: file.name, status: "Unknown error occured!", icon: "Rejected" };
        }
      })
    );
  }

  backToUpload() {
    this.isExcelUploaded = false;
    this.reset();
    this.dataSource.data = []
  }
  async configFileUpload(file: CustomFile) {
    try {
      this.notificationFileHeader = await firstValueFrom(this.fileService.readExcel(file, 1));
      const { data }: any = await firstValueFrom(this.apollo.query({
        query: GET_MASTER_DATA,
        variables: {
          categoryName: "openNotificationExcel",
        },
      }));
      const result: any = data.getMasterData;
      for (const item of result) {
        this.masterData.push(item.masterName.split(':')[1]);
      }
      const colNotPresent = this.masterData.filter(data => !this.notificationFileHeader.includes(data))
      if (colNotPresent.length !== 0) {
        this.configErr = true
        file.errMsg = "\"" + colNotPresent + " \" columns not found in this excel. Please configure";
      }
    } catch (error) {
      console.error(error);
    }

  }
  getOrdersWoPositions() {
    this.uploadService.getOrdersWoPositions().subscribe(data => {
      const dataString = JSON.stringify(data);
      const storedData = dataString.substring(1, dataString.length - 1);
      this.ordersData = storedData.split(',').join(', ');
    });
  }
  onTabChange(event: MatTabChangeEvent) {
    const selectedTabIndex = event.index;
    switch (selectedTabIndex) {
      case 0:
        break;
      case 1:
        this.getOrdersWoPositions()
        break;
      default:
        break;
    }
  }
  /*
  configErr = false
  filedataSourceLoading = false
  ordersData // to send data to pdf component
  MAX_LENGTH = 10.00 //MB
  totalFileSize = 0.0
  closeOrd = { orders: "Closed Orders", orderNo: "",totalCount:0 }
  newOrd = { orders: "New Orders", orderNo: "",totalCount:0 }
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['orders', 'orderNo']
  displayedColumns1: string[] = ['fileName', 'status', 'icon',]
  fileDataSource;
  fileData;
  notificationFileHeader = []
  masterData = []
  columnData = []// to get openNotification data
  isAcceptClicked: boolean = false; // To check accept button is clicked or not
  disableExcelDndDiv: boolean = false; //  to disable drag nd drop after selecting only one excel open position file
  isExcelUploaded: boolean = false; // to check whether the excel is uploaded or not if it is true it hides the excel div and displays pdf div
  fileStatusTable: boolean = false // To display the status of upload file
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlertExcel: boolean = false;
  ordersAcceptedList = []
  files: any[] = [];

  constructor(private uploadService: UploadDdService, private apollo: Apollo,
    private fileService: FileServiceService, private router: Router) { }

  /** on file drop handler *
  onFileDroppedExcel($event) {
    this.prepareFilesListExcel($event);
  }

  /**  handle file from browsing *
  fileBrowseHandlerExcel(files) {
    this.prepareFilesListExcel(files);
  }

  /*** Delete file from files list * @param index (File index) *
  deleteFileExcel(index: number) {
    this.configErr = false
    this.masterData = []
    this.notificationFileHeader = []
    this.totalFileSize = this.totalFileSize - this.files[index].size
    this.countTotalFilesSize();
    this.files.splice(index, 1);
    this.disableExcelDndDiv = false
  }

  /** To get master data for column mapping *
  getMasterData() {
    let result
    this.apollo.watchQuery({
      query: GET_MASTER_DATA,
      variables: {
        categoryName: "openNotificationExcel",
      }
    }).valueChanges.subscribe((data: any) => {
      result = data.data.getMasterData
      for (let data of result) {
        this.masterData.push(data.masterName.split(':')[1])
      }
    })
  }
  /** getting header row to uploaded file *
  getFileHeader(file: File) {
    this.fileService.readExcel(file, 1).subscribe({
      next: (data) => {
        this.notificationFileHeader = data
      }
    })
  }
  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   *
  prepareFilesListExcel(localfiles: Array<any>) {
    this.showAlertExcel = false;
    for (const file of localfiles) {
      const allowedTypes = ['xls', 'xlsx', 'xlsm'];
      const fileExtension = file.name.split('.').pop();
      if (!allowedTypes.includes(fileExtension)) {
        this.showErrorAlert("Please upload only excel file with .xlsx /.xls /.xlsm extension")
      }
      else {
        if (file.name.split(".")[0].toLowerCase().includes("position")) {
          this.configFileUpload(file)
          .then(() => {
            // Handle the result or continue with the next steps
            
          })
          .catch((error) => {
            console.log(error)
          });
          this.disableExcelDndDiv = true;
          this.files.push(file);
        }
        else {
          this.showErrorAlert("Please upload file with name position")
          
        }
      }
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   *
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  reset() {
    /*
    this.closeOrd.orderNo = ""
    this.closeOrd.totalCount =0
    this.newOrd.orderNo = ""
    this.newOrd.totalCount =0
    this.isAcceptClicked = false;

    *
    this.masterData = []
    this.notificationFileHeader = []
    this.files = [];
    this.disableExcelDndDiv = false
    this.isExcelUploaded = false;
    this.totalFileSize = 0.0;
    this.showAlertExcel = false;
    this.fileStatusTable = false
    this.fileData = ""
    this.configErr = false
    this.fileDataSource.data = []
  }
  countTotalFilesSize() {
    let type, size1;
    [size1, type] = this.formatBytes(this.totalFileSize, 2).split(' ')
    if (size1 > this.MAX_LENGTH && type == "MB") {
      return false;
    }
    else
      return true;
  }

  countFileSize(size) {
    let type, size1;
    this.totalFileSize += size;
    if (this.countTotalFilesSize()) {
      return true;
    }
    else {
      this.countTotalFilesSize();
      [size1, type] = this.formatBytes(this.totalFileSize, 2).split(' ')
      if (size1 > this.MAX_LENGTH && type == "MB") {
        this.totalFileSize -= size;
        this.showErrorAlert("Upload only " + this.MAX_LENGTH + " MB at a time")
      }
    }
  }
  excelUpload() {
    this.showAlertExcel = false;
    this.fileData = this.files[0]?.name;
    if (this.files.length === 0) {
      this.showErrorAlert("Upload at least one excel file with .xlsx /.xls /.xlsm extension to continue")
      return;
    }
    // this.accept()
    this.handleExcelUploadResponse();
    this.files = [];
    this.isExcelUploaded = true;
    this.files.splice(0);
  }
  
  handleExcelUploadResponse( ){
    this.uploadService.uploadNotificationExcel(this.files).subscribe({
      next: (a) => {
        if (a.length !== 0 && a.status !== "500 INTERNAL_SERVER_ERROR") {
          if (a.closingOrders.length > 0) {
            this.closeOrd.orderNo = a.closingOrders.map((o) => o.orderNo).join(", ");
            this.closeOrd.totalCount = a.closingOrders.length
            if (this.closeOrd.orderNo !== "") {
              this.closeOrd.orderNo += "";
            }
          }
          if (a.newOrders.length > 0) {
            this.newOrd.orderNo = a.newOrders.map((o) => o.orderNo).join(", ");
            this.newOrd.totalCount = a.newOrders.length
            if (this.newOrd.orderNo !== "") {
              this.newOrd.orderNo += "";
            }
          }
          this.dataSource.data = [this.closeOrd, this.newOrd];
          this.ordersAcceptedList = a;
        } else {
          this.disableExcelDndDiv = false;
          this.reset();
          this.showErrorAlert("No orders found in the excel you have uploaded. Please upload the correct excel file.")
        }
      }
    });
  }

  reject() {
    this.reset();
  }
  async configFileUpload(file: CustomFile) {
    try {
      this.notificationFileHeader = await firstValueFrom(this.fileService.readExcel(file, 1));
      const { data }: any = await firstValueFrom(this.apollo.query({
        query: GET_MASTER_DATA,
        variables: {
          categoryName: "openNotificationExcel",
        },
      }));
      const result: any = data.getMasterData;
      for (const item of result) {
        this.masterData.push(item.masterName.split(':')[1]);
      }
      const colNotPresent = this.masterData.filter(data => !this.notificationFileHeader.includes(data))
      if(colNotPresent.length !== 0){
        this.configErr = true
        file.errMsg = "\"" + colNotPresent + " \" columns not found in this excel. Please configure";
      }
    } catch (error) {
      console.error(error);
    }
  }
  showErrorAlert(message: string): void {
    this.alert = {
      type: "error",
      message: message,
    };
    this.showAlertExcel = true;
  }
  accept() {
    this.dataSource.data = []
    this.fileDataSource = new MatTableDataSource<any>();
    const uploadObservables: Observable<any>[] = [];
    uploadObservables.push(this.updateFileStatus());
    forkJoin(uploadObservables).subscribe((uploadedFiles: any[]) => {

      this.isAcceptClicked = true
      this.fileStatusTable = true
      this.fileDataSource.data = uploadedFiles;
      this.isExcelUploaded = true;
      this.showAlertExcel = false
      this.files = [];
    });
  }

  updateFileStatus() {
    return this.uploadService.ordersChangeAccepted(this.ordersAcceptedList).pipe(
      map((data: any) => {
        if (data.status != "500 INTERNAL_SERVER_ERROR" && data.status != "404 NOT_FOUND") {
          this.router.navigate(['/positions']);
          // return { fileName: this.fileData, status: "Uploaded", icon: "Uploaded" };
        }
        else if (data.status == "925") {

          return { fileName: this.fileData, status: data.message, icon: "Rejected" };
        }
        else {
          return { fileName: this.fileData, status: "Unknown error occured!", icon: "Rejected" };
        }
      })
    );
  }
  backToUpload() {
    this.reset()
  }
  
  getOrdersWoPositions() {
    this.uploadService.getOrdersWoPositions().subscribe(data => {
      const dataString = JSON.stringify(data);
      const storedData = dataString.substring(1, dataString.length - 1);
      this.ordersData = storedData.split(',').join(', ');
    });
  }
  onTabChange(event: MatTabChangeEvent) {
    const selectedTabIndex = event.index;
    switch (selectedTabIndex) {
      case 0:
        break;
      case 1:
        this.getOrdersWoPositions()
        break;
      default:
        break;
    }
  }
  */
}
