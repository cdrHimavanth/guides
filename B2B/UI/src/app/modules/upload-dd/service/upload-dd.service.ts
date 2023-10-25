import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GET_MASTER_DATA } from 'app/gqloperations/getQueries.operations';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class UploadDdService {
  private baseUrl = `${environment.apiUrl}`;
  pdfFileArraySubject: BehaviorSubject<File[]> = new BehaviorSubject<File[]>([]);
  bidInfoFiles: BehaviorSubject<File[]> = new BehaviorSubject<File[]>([]);
  masterData: BehaviorSubject<File[]> = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient, private apollo: Apollo) { }

  getAllPdfFiles() {
    return this.pdfFileArraySubject;
  }

  getAllBidInfoFiles() {
    return this.bidInfoFiles;
  }
  uploadNotificationExcel(files: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('files', files[0], files[0].name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<any[]>(`${this.baseUrl}` + "orders/upload", formData, { headers: headers });
  }

  ordersChangeAccepted(list: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}` + "orders/accept", list);
  }

  uploadPdfs(files: any): Observable<any[]> {
    const formData: FormData = new FormData();
    for (let file of files) {
      formData.append('files', file, file.name)
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post<any[]>(`${environment.apiUrl}` + 'position/upload', formData, {reportProgress: true,responseType: 'json', headers: headers });
  }

  uploadBidsReport(files: any): Observable<any[]> {
    const formData: FormData = new FormData();
    for (let file of files) {
      formData.append('files', file, file.name)
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<any[]>(`${environment.apiUrl}` + 'bid-info/received', formData, { headers: headers });
  }
  uploadSubmissionReport(files: any): Observable<any[]> {
    const formData: FormData = new FormData();
    for (let file of files) {
      formData.append('files', file, file.name)
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<any[]>(`${environment.apiUrl}` + 'bid-info/submission', formData, { headers: headers });
  }
  uploadDeclineReport(files: any): Observable<any[]> {
    const formData: FormData = new FormData();
    for (let file of files) {
      formData.append('files', file, file.name)
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<any[]>(`${environment.apiUrl}` + 'bid-info/declined', formData, { headers: headers });
  }
  getOrdersWoPositions() {
    return this.http.get(`${this.baseUrl}` + 'orders/orderswopositions');
  }
  getMasterDataGpql(categoryName: string) {
    this.apollo.watchQuery({
      query: GET_MASTER_DATA,
      variables: {
        categoryName: categoryName,
      }
    }).valueChanges.subscribe((data: any) => {
      this.masterData = data.data.getMasterData
    })
  }

}
