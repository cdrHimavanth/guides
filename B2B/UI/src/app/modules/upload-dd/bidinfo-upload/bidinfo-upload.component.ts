import { Component, ViewEncapsulation, } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { UploadDdService } from '../service/upload-dd.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, firstValueFrom, forkJoin, map } from 'rxjs';
import { FileServiceService } from '../service/file/file-service.service';
import { Apollo } from 'apollo-angular';
import { GET_MASTER_DATA } from 'app/gqloperations/getQueries.operations';
import { Router } from '@angular/router';
import { B2bAlertMessageService } from 'app/shared/b2b-alert-message.service';

interface CustomFile extends File {
  errMsg: string
}
@Component({
  selector: 'bidinfo-upload',
  templateUrl: './bidinfo-upload.component.html',
  styleUrls: ['./bidinfo-upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BidinfoUploadComponent {

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
        if (file.name.split(".")[0].toLowerCase().includes("receive")) {
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
          this.showErrorAlert("Please upload file with name receive")

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
    return this.uploadService.uploadBidsReport([file]).pipe(
      map((data: any) => {
        if (data.status != "500 INTERNAL_SERVER_ERROR" && data.status != "925") {
        this.alertService.showSuccess("Uploaded successfully")

          this.router.navigate(['/bidinfo']);

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
          categoryName: "bidReceivedExcel",
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

}
/*
 /*
  isExcelUploadFailed = false
  configErr = false
  excelAlertMsg = ""
  dialogOpen
  dataSource
  MAX_LENGTH = 100.00
  totalFileSize = 0.0
  bidInfoCount = 0
  submissionCount = 0
  declinedCount = 0
  uniqueFilesNames: string[] = []; // Array to store the excel file names
  disableExcelDndDiv: boolean = false; //  to disable drag nd drop after selecting only one excel open position file
  isExcelUploaded: boolean = false; // to check whether the excel is uploaded or not if it is true it hides the excel div and displays pdf div
  progressCompleted: boolean = false // To check the progress bar status
  alert: { type: FuseAlertType; message: string } = {
    type: "warning",
    message: "",
  };
  showAlertExcel: boolean = false;
  displayedColumns: string[] = ['fileName', 'status', 'icon',] // displays table of files with status
  completedCountPdf = 0; // to count the no.of progress bar is completed
  filesList: CustomFile[] = [];

  // To stores master data
  bidMasterData = [];
  submissionMasterData = [];
  declineMasterData = [];

  // To display error msg for mismatch column
  bidErrMsg = "";
  submissionErrMsg = "";
  declineErrMsg = "";

  // To store excel header data
  bidsExcelHeader = [];
  submissionExcelHeader = [];
  declineExcelHeader = [];

  showAlert: boolean;
  constructor(private uploadService: UploadDdService, private apollo: Apollo,
    private fileService: FileServiceService,) {
      console.log(this.filesList.length)
  }

  // on file drop handler ****
  onFileDroppedExcel($event) {
    this.prepareFilesListExcel($event);
  }

  //**  handle file from browsing 
  fileBrowseHandlerExcel(files) {
    this.prepareFilesListExcel(files);
  }
  deleteFileExcel(index: number) {
    if (index >= 0 && index < this.filesList.length) {
      this.totalFileSize = this.totalFileSize - this.filesList[index].size;
      this.countTotalFilesSize();
      const fileName = this.filesList[index]?.name;
      const uniqueFileIndex = this.uniqueFilesNames.findIndex(name => name === fileName);
      if (uniqueFileIndex !== -1) {
        this.uniqueFilesNames.splice(uniqueFileIndex, 1);
      }
      this.filesList.splice(index, 1);

    }
  }
  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   *
 prepareFilesListExcel(localFilesList: any) {
    this.showAlertExcel = false;
    const allowedTypes = ['xls', 'xlsx', 'xlsm'];
    for (const file of localFilesList) {
      const fileExtension = this.getFileExtension(file.name);
      if ((this.isFileTypeAllowed(fileExtension, allowedTypes)) && (this.filesList.length <= 2) && (!this.isDuplicateFile(file.name)) && (this.isValidFileName(file.name))) {
        this.uniqueFilesNames.push(file.name);
        this.filesList.push(file);
        this.configFileUpload(file)
          .then(() => {
          })
          .catch((error) => {
            console.log(error);
          });
        this.uploadService.getAllBidInfoFiles().next(this.filesList);
      }
      else {
        if (!this.isFileTypeAllowed(fileExtension, allowedTypes))
          this.showErrorAlert("Please upload only excel file with .xlsx extension");
        else if (this.filesList.length >= 2)
          this.showErrorAlert("Only 3 Excel files allowed at a time");
        else if (this.isDuplicateFile(file.name))
          this.showErrorAlert(`${file.name} is already selected`);
        else if (!this.isValidFileName(file.name))
          this.showErrorAlert("Please upload excel files with name 'Bids Received',  'Candidate Decline Report', 'Candidate Submission Report'")
      }
    }
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase();
  }

  isFileTypeAllowed(fileExtension: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(fileExtension);
  }

  isDuplicateFile(filename: string): boolean {
    return this.uniqueFilesNames.includes(filename);
  }

  isValidFileName(filename: string): boolean {
    const lowerCaseFileName = filename.split(".")[0].toLowerCase();
    return lowerCaseFileName.includes("receive") ||
      lowerCaseFileName.includes("submission") ||
      lowerCaseFileName.includes("decline");
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
  resetButton() {
    this.showAlertExcel = false
    this.filesList = [];
    this.totalFileSize = 0.0;
    this.uniqueFilesNames = []
    this.showAlert = false;
    this.excelAlertMsg = ""
    this.configErr = false

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
    this.showAlert = false
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
    return this.uploadService.uploadBidsReport([file]).pipe(
      map((data: any) => {
        if (data.status != "500 INTERNAL_SERVER_ERROR" && data.status != "925") {
          return { fileName: file.name, status: "Uploaded", icon: "Uploaded" };
        } else if (data.status == "925") {
          return { fileName: file.name, status: data.message, icon: "Rejected" };
        }
        else {
          return { fileName: file.name, status: "Unknown error occured!", icon: "Rejected" };
        }
      })
    );
  }

  backToUpload() {
    this.isExcelUploaded = false;
    this.resetButton();
    this.dataSource.data = []
  }
  async configFileUpload(file: CustomFile) {
    try {
      if (file.name.split(".")[0].toLowerCase().includes("receive")) {
        this.bidsExcelHeader = await firstValueFrom(this.fileService.readExcel(file, 1))
        this.checkMasterData("bidReceivedExcel", this.bidsExcelHeader, file).subscribe({
          next: (data) => {
          },
          error: (err) => {
            console.log(err)
          }
        })
      } else if (file.name.split(".")[0].toLowerCase().includes("submission")) {
        let dataArray = await firstValueFrom(this.fileService.readExcel(file, 3))
        this.submissionExcelHeader = Object.values(dataArray);
        this.checkMasterData("candidateSubmissionReportExcel", this.submissionExcelHeader, file).subscribe({
          next: (data) => {
          },
          error: (err) => {
            console.log(err)
          }
        })
      }
      else if (file.name.split(".")[0].toLowerCase().includes("decline")) {
        let dataArray = await firstValueFrom(this.fileService.readExcel(file, 3))
        this.declineExcelHeader = Object.values(dataArray);
        this.checkMasterData("candidateDeclineReportExcel", this.declineExcelHeader, file).subscribe({
          next: (data) => {
          },
          error: (err) => {
            console.log(err)
          }
        })
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  //** Getting data from master and checking whether these columns were present in excel or not 
  checkMasterData(categoryName, fileHeader, file): Observable<any> {
    return this.apollo.query({
      query: GET_MASTER_DATA,
      variables: {
        categoryName: categoryName,
      },
    }).pipe(
      map((response: any) => {
        const data = response.data;
        const result: any = data.getMasterData;
        const masterResult = result.map(item => item.masterName.split(':')[1]);
        const colNotPresent = masterResult.filter(data => !fileHeader.includes(data));
        if (colNotPresent.length !== 0) {
          this.configErr = true
          file.errMsg = "\"" + colNotPresent + " \" columns not found in this excel. Please configure \n";
        }
        return masterResult;
      })
    );
  }
*/

