import { Component, Input, OnInit, } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { UploadDdService } from '../../service/upload-dd.service';
import { MatTableDataSource } from '@angular/material/table';
import { PositionUploadComponent } from '../position-upload.component';
import { Observable, forkJoin, map } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-position-pdf-upload',
  templateUrl: './position-pdf-upload.component.html',
  styleUrls: ['./position-pdf-upload.component.scss']
})
export class PositionPdfUploadComponent implements OnInit {
  uploadClicked = false
  unknownErrorOcuured = false
  currentFile?: File;
  progress = 0;
  message = '';

  fileName = 'Select File';
  fileInfos: any[] = [];

  @Input() ordersData: any
  MAX_LENGTH = 10.00 // MB
  totalFileSize = 0.0
  displayedColumns: string[] = ['fileName', 'status', 'icon',]
  dataSource = new MatTableDataSource<any>();
  isPdfUploaded: boolean = false
  uniqueFilesNames: string[] = []; // Array to store the PDF file names
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlertPdf: boolean = false;
  files: any[] = [];

  constructor(private uploadService: UploadDdService, private positionUploadRef: PositionUploadComponent) { }
  ngOnInit(): void {
    this.getAllOrdersData();
    // this.fileInfos = this.uploadService.getAllPdfFiles();

  }

  /** on file drop handler */
  onFileDroppedPdf($event) {
    this.prepareFilesListPdf($event);
  }

  fileBrowseHandlerPdf(localfiles) {
    this.prepareFilesListPdf(localfiles);
  }

  /*** Delete file from files list * @param index (File index) */
  deleteFilePdf(index: number) {
    this.totalFileSize = this.totalFileSize - this.files[index].size;
    this.countTotalFilesSize();
    const fileName = this.files[index]?.name;
    const uniqueFileIndex = this.uniqueFilesNames.findIndex(name => name === fileName);
    if (uniqueFileIndex !== -1) {
      this.uniqueFilesNames.splice(uniqueFileIndex, 1);
    }
    this.files.splice(index, 1);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesListPdf(localfiles: Array<any>) {
    for (const file of localfiles) {
      const allowedTypes = ['pdf'];
      const fileExtension = this.getFileExtension(file.name);
      if (!this.isFileTypeAllowed(fileExtension, allowedTypes)) {
        this.showErrorAlert("Please upload only pdf file");
      } else {
        // if (this.isFileSizeValid(file.size)  && this.files.length >= 9 && !this.isDuplicateFile(file.name)) {
        if (!this.isDuplicateFile(file.name)) {
          this.uniqueFilesNames.push(file.name);
          this.files.push(file);
          this.uploadService.getAllPdfFiles().next(this.files);
        }

        else {
          /*
          if (!this.isFileSizeValid(file.size)) {
            this.showErrorAlert("File size exceeds the limit");
          } 
          else if (this.files.length >= 9) {
            this.showErrorAlert("Only 10 pdf files allowed at a time");
          } 
          */
          if (this.isDuplicateFile(file.name)) {
            this.showErrorAlert(`${file.name} is already selected`);
          }
        }
      }
    }
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase();
  }

  isFileTypeAllowed(fileExtension: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(fileExtension);
  }

  isFileSizeValid(fileSize: number): boolean {
    return this.countFileSize(fileSize);
  }

  isDuplicateFile(filename: string): boolean {
    return this.uniqueFilesNames.includes(filename);
  }
  showErrorAlert(message: string): void {
    this.alert = {
      type: "error",
      message: message,
    };
    this.showAlertPdf = true;
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
  resetButton() {
    this.showAlertPdf = false;
    this.files = [];
    this.totalFileSize = 0.0;
    this.uploadService.getAllPdfFiles().next(null);
    this.uniqueFilesNames = []
    this.isPdfUploaded = false;
    this.positionUploadRef.reset();
    this.dataSource.data = null
    this.getAllOrdersData();
    this.uploadClicked = false
    this.fileInfos = []
    this.unknownErrorOcuured = false
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

  pdfUpload() {
    this.showAlertPdf = false;
    if (this.files.length !== 0) {
      const uploadObservables: Observable<any>[] = [];
      for (const file of this.files) {
      this.uploadClicked = true
        this.uploadFile(file)
      }
    } else {
      this.showErrorAlert("Upload at least one pdf file to continue")
    }
    this.files.splice(0);
  }
  currentFileIndex: number = 0;
  pdfUpload1() {
    this.showAlertPdf = false;
    if (this.files.length !== 0) {
      const uploadObservables: Observable<any>[] = [];
      for (const file of this.files) {
        // uploadObservables.push(this.uploadFile(file));
      }
      forkJoin(uploadObservables).subscribe((uploadedFiles: any[]) => {
        this.dataSource.data = uploadedFiles;
        this.getAllOrdersData();
        this.isPdfUploaded = true;
        this.files = [];
      });
    } else {
      this.showErrorAlert("Upload at least one pdf file to continue")
    }
    this.files.splice(0);
  }
  /*
  */
  uploadFile(file: File): void {
    console.log("upload file calle")
    this.uploadService.uploadPdfs([file]).subscribe(
      {

        next: (data: any) => {
          let file1
          if (data.status != "500 INTERNAL_SERVER_ERROR" && data.status != "404 NOT_FOUND" && data.status != "925") {
            file1 = { fileName: file.name, status: "Uploaded", icon: "Uploaded" };
            this.fileInfos.push(file1)
          }
          else if (data.status == "925") {
            file1 = { fileName: file.name, status: data.message, icon: "Rejected" };
            this.fileInfos.push(file1)
          }
          else {
            file1 = { fileName: file.name, status: "Unknown error occured!", icon: "Rejected" };
            this.fileInfos.push(file1)
          }
        },
        error: (err) => {
          this.unknownErrorOcuured = true
          console.log(err)
        },

        complete: () => {

        }
      })
  }


  private uploadFile1(file: File): Observable<any> {
    return this.uploadService.uploadPdfs([file]).pipe(
      map((data: any) => {
        if (data.status != "500 INTERNAL_SERVER_ERROR" && data.status != "404 NOT_FOUND" && data.status != "925") {
          return { fileName: file.name, status: "Uploaded", icon: "Uploaded" };
        }
        else if (data.status == "925") {

          return { fileName: file.name, status: data.message, icon: "Rejected" };
        }
        else {
          return { fileName: file.name, status: "Unknown error occured!", icon: "Rejected" };
        }
      })
    );
  }

  backToUpload() {
    this.resetButton();
  }
  // Getting orders data which are not having positions
  getAllOrdersData() {
    this.uploadService.getOrdersWoPositions().subscribe(data => {
      const dataString = JSON.stringify(data);
      const storedData = dataString.substring(1, dataString.length - 1);
      this.ordersData = storedData.split(',').join(', ');
    });
  }

}
