import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BidFilterValues, FilterValues, SourcingFilter } from './shared.data';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  

  public searchStringSubject : BehaviorSubject<string> = new BehaviorSubject("");
  public positionfilterValuesSubject : BehaviorSubject<FilterValues>= new BehaviorSubject(new FilterValues());
  public bidfilterValuesSubject : BehaviorSubject<BidFilterValues>= new BehaviorSubject(new BidFilterValues());

  public bidInfoSearchStringSubject : BehaviorSubject<string> = new BehaviorSubject("");

  public closedOpenToggleSubject : BehaviorSubject<boolean> = new BehaviorSubject(true);
  
  public sourcingFilterOnSubject : BehaviorSubject<boolean> = new BehaviorSubject(false);

  public sourcingFilterSubject : BehaviorSubject<SourcingFilter> = new BehaviorSubject(new SourcingFilter());
  

}
