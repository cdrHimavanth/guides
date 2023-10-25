import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { Apollo } from 'apollo-angular';
import { GET_MASTER_DATA } from 'app/gqloperations/getQueries.operations';
import { firstValueFrom, Observable, forkJoin, map } from 'rxjs';
import { FileServiceService } from '../service/file/file-service.service';
import { UploadDdService } from '../service/upload-dd.service';
import { Router } from '@angular/router';
import { B2bAlertMessageService } from 'app/shared/b2b-alert-message.service';

interface CustomFile extends File{
  errMsg: string
}

@Component({
  selector: 'candidate-decline-upload',
  templateUrl: './candidate-decline-upload.component.html',
  styleUrls: ['./candidate-decline-upload.component.scss']
})

export class CandidateDeclineUploadComponent {
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
  notificationFileHeader ;
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
        if (file.name.split(".")[0].toLowerCase().includes("decline")) {
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
          this.showErrorAlert("Please upload file with name decline")

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
    return this.uploadService.uploadDeclineReport([file]).pipe(
      map((data: any) => {
        if (data.status != "500 INTERNAL_SERVER_ERROR" && data.status != "925") {
        this.alertService.showSuccess("Uploaded successfully")

          this.router.navigate(['/candidate-info']);

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
      this.notificationFileHeader = await firstValueFrom(this.fileService.readExcel(file, 3));
      const { data }: any = await firstValueFrom(this.apollo.query({
        query: GET_MASTER_DATA,
        variables: {
          categoryName: "candidateDeclineReportExcel",
        },
      }));
      const result: any = data.getMasterData;
      for (const item of result) {
        this.masterData.push(item.masterName.split(':')[1]);
      }
      const colNotPresent = this.masterData.filter(data => !this.notificationFileHeader.includes(data))
      if (colNotPresent.length !== 0) {
        this.configErr = true
        file.errMsg = "\"" + colNotPresent + " \" column(s) not found in this excel. Please configure";
      }
    }
    
    catch (error) {
      try{
        this.notificationFileHeader=Object.values(this.notificationFileHeader);
       const colNotPresent = this.masterData.filter(data => !this.notificationFileHeader.includes(data))
       if (colNotPresent.length !== 0) {
         this.configErr = true
         file.errMsg = "\"" + colNotPresent + " \" column(s) not found in this excel. Please configure";
       }
      }
      catch(e){
        console.log(e)
      }
       

    }

  }

}