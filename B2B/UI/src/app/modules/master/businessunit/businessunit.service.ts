import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn:"root"
})

export class BusinessUnitService{

    private editBusinessUnitDetails:BehaviorSubject<any> = new BehaviorSubject<any>(null);

    getEditBusinessUnitDetails(){
        return this.editBusinessUnitDetails;
    }

}