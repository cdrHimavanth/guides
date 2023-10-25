export interface Master {
    masterId:number;
    masterCategory: string;
    masterName:string;

}

export interface BusinessUnit {
    id: BusinessUnitPK;
    buName:string;
    productLineName:string;

}

export interface BusinessUnitPK{
    buId:number;
    productLineId:number;
}

export interface Manager {
    managerId?:number;
    ll2Manager?:string;
    ll3Manager?:string;
    ll4Manager?:string;
    ll5Manager?:string;
    ll6Manager?:string;
}

export interface MasterInput{
    masterCategory:string;
    masterName: string;
}

export interface MasterUpdateInput{
    existingMasterName:string;
    updatedMasterName:string;
}

export interface ManagerDto{
    ll2Manager : string;
    ll3Manager : string;
    ll4Manager : string;
    ll5Manager : string;
    ll6Manager : string;
}

export interface BusinessUnitDto{
    buName : string
}

export interface UpdateBusinessUnitDto{
    existingBuName : string
    updatedBuName : string
}

export interface AddProductLineDto{
    buName : string
    productLineName : string
}
export interface UpdateProductLineDto{
    buName : string
    existingProductLineName : string
    updatedProductLineName : string
}
export class BroadcastDate{
    start:string;
    end:string;
    constructor(){
        this.start=null;
        this.end=null;
    }
}

export class SourcingFilter{
    sourcingFilterOn:boolean=false;
    sourcingToggle:boolean=true;
    souricngOrders:[]=[];
    constructor(){
        this.sourcingFilterOn=false;
        this.sourcingToggle = true;
        this.souricngOrders =[];
    }
}


export class FilterValues{
    date?:BroadcastDate;
    skillGroup:string="";
    regionName:string="";
    orderType:string="";
    buName:string="";
    ll2Manager:string="";
    ll3Manager:string="";
    ll4Manager:string="";
    ll5Manager:string="";
    ll6Manager:string="";
    constructor(){
        this.date=null;
        this.skillGroup="";
        this.regionName="";
        this.orderType="";
        this.buName="";
        this.ll2Manager="";
        this.ll3Manager="";
        this.ll4Manager="";
        this.ll5Manager="";
        this.ll6Manager="";
        
    }
}
export class BidFilterValues{
    date?:BroadcastDate;
} 



