import { environment } from 'environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CandidateInfoService {
    private baseUrl =`${environment.apiUrl}`;

    constructor (private http:HttpClient){}

    getAllCandidates() {
        return this.http.get(`${this.baseUrl}` + 'candidate');
      }
}