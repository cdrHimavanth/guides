import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn:"root"
})

export class MasterService{

    private editMasterDetails:BehaviorSubject<any> = new BehaviorSubject<any>(null);
   

    getEditMasterDetails(){
        return this.editMasterDetails;
    }

}