import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn:"root"
})

export class ManagerService{

    private editManagerDetails:BehaviorSubject<any> = new BehaviorSubject<any>(null);

    getEditManagerDetails(){
        return this.editManagerDetails;
    }

}