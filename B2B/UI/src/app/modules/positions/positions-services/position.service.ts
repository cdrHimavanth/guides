import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private baseUrl = `${environment.apiUrl}`;
  private positionDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private allPositionsDetails: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  constructor(private http: HttpClient) { }
  // Send data to Mat-drawer
  getPositionDetails() {
    return this.positionDetails;
  }
  // From backend
  getAllPositionDetails() {
    return this.http.get(`${this.baseUrl}` + 'orders');
  }
  getAllOpenPositionDetails() {
    return this.http.get(`${this.baseUrl}` + 'orders/true');
  }
  getAllClosedPositionDetails() {
    return this.http.get(`${this.baseUrl}` + 'orders/false');
  }
  getAllSourcingPositionDetails(sourcingOrders:any){
    return this.http.post(`${this.baseUrl}` + `orders/sourcing`, sourcingOrders);
  }
  getAllPositionDetails1() {
    return this.allPositionsDetails;
  }

  getOrdersWoPositoins(){
    return  this.http.get(`${this.baseUrl}` + 'orders/orderswopositions');
  }

  getAllrecruiters() {
    return this.http.get(`${this.baseUrl}` + 'ldap/recruiters');
  }
  updatePositionDetails(updateDetailsObj) {
    return this.http.put(`${this.baseUrl}` + 'orders/update', updateDetailsObj);
  }

  uploadPositions(positionObject, orderNo){
    let formData= new FormData();
    formData.append("files",positionObject)
    const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
    return this.http.post(`${this.baseUrl}` + 'position/upload/'+orderNo, formData);
  }

  
}
