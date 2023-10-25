import { environment } from 'environments/environment';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HrreportsService {
  private baseUrl=`${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  getRecruiterDetails(){
    return this.http.get(`${this.baseUrl}`+'reports/recruiterDetails');
  }

  getPositionByMonthDetails(){
    return this.http.get(`${this.baseUrl}`+'reports/positionByMonth');
  }

  getAllOrdersByMonthDetails(){
    return this.http.get(`${this.baseUrl}`+'reports/allOrdersByMonth');
  }

  getPositionBySkillDetails(){
    return this.http.get(`${this.baseUrl}`+'reports/positionBySkillDetails');
  }

  getDetails(name:string): Observable < any > {
    return this.http.get(`${this.baseUrl}`+`reports/positionDetails/${name}`);
  }

  getBidReports(){
    return this.http.get(`${this.baseUrl}`+'reports/bidDetails');
  }
}
