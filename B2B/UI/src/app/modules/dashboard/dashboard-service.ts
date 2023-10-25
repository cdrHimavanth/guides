import { environment } from 'environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    private baseUrl =`${environment.apiUrl}`;

    constructor (private http:HttpClient){

    }

    public getGraphData(period:string,entity:string,toggle:string){
      return this.http.get(`${this.baseUrl}dashboard/${period}/${entity}/${toggle}`);
    }

    private handleError(error : any){
      return throwError(()=> error)
    }

    async makeSyncRequest(url : string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.get(`${this.baseUrl}` + url).pipe(
              map((data: any) => {
                resolve(data);
              }),
              catchError((error: any) => {
                reject(error);
                return this.handleError(error);
              })
            ).subscribe();
          });
      }

    async getPositionsData()  {

        

        try {
            const result = await this.makeSyncRequest("dashboard/openPositions");
            return result;
          } catch (error) {
            return error;
          }

    }

    async getBidSubmissionSummary() {
        try{
            const result = await this.makeSyncRequest('dashboard/bidSubmission');
            return result;
        }
        catch(error){
            return error;
        }
       
    }

    async getOrdersData() {
      try{
        const result = await this.makeSyncRequest('dashboard/orders');
        return result;
      }
      catch(error){
        return error;
    }
    }

    async getPositionsByManager() {
      try{
        const result = await this.makeSyncRequest('dashboard/positionByManager');
        return result;
      }
      catch(error){
        return error;
    }
    
    }

    async getOrderTypeByRegion() {
      try{
        const result = await this.makeSyncRequest('dashboard/orderTypeByRegion');
        return result;
      }
      catch(error){
        return error;
    }
    }

    async getOrderTypeByBu() {
      try{
        const result = await this.makeSyncRequest('dashboard/orderTypeByBu');
        return result;
      }
      catch(error){
        return error;
    }
    }

}