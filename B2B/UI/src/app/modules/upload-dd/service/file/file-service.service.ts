import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as XLSX from "xlsx";
@Injectable({
  providedIn: 'root'
}) 
export class FileServiceService {

  fileArraySubject: BehaviorSubject<File[]> = new BehaviorSubject<File[]>([]);
  excelColObj = []

  getFileArray() {
    return this.fileArraySubject;
  }

  getExcelColObj() {
    return this.excelColObj;
  }

  readExcel(file: File, headerNo : number) {
  return new Observable((observer: Observer<any[]>) => {
    console.log("readExcel called" )
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const sheetData: any[][] = XLSX.utils.sheet_to_json(ws, { header: headerNo, raw: false });
      const headerRow: any[] = sheetData[0];
      observer.next(headerRow);
      observer.complete();
    };
    reader.onerror = (error) => {
      observer.error(error);
    };
    reader.readAsBinaryString(file);
  });
  }
}
