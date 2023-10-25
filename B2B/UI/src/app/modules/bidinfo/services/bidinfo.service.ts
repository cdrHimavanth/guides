import { environment } from 'environments/environment';
import { HttpClient } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BidinfoService {
  
  private baseUrl =`${environment.apiUrl}`;
  private bidInfoDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  constructor(private http: HttpClient) {}
  getBidInfoDetails() {
    return this.bidInfoDetails;
  }

  getAllBidInfo(isChecked){
    return this.http.get(`${this.baseUrl}`+'bid-info/'+`${isChecked}`);
  }

  updateBidInfo(data:any){
    return  this.http.put((`${this.baseUrl}`+'bid-info'), data)
  }
  updateInterview(data:any){
    return this.http.put((`${this.baseUrl}`+'interview'), data)
  }

  createInterview(data:any):any{
    return this.http.post((`${this.baseUrl}`+'interview'), data)
  }
  getInterviews(bidNo:Number):any{
    
    return this.http.get((`${this.baseUrl}`+`interview/list/${bidNo}`))
  }
}
