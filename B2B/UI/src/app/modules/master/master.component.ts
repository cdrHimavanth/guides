import {  Component, OnInit } from '@angular/core';
import { FuseNavigationItem, FuseNavigationService } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject } from 'rxjs';
import {Location} from "@angular/common"

const masterMenu:FuseNavigationItem[] =[
  {
  id   : '1',
  title: 'Managers',
  type : 'basic',
  icon : 'heroicons_outline:user-group',
  link : '/admin/managers'
  },
  {
    id   : '2',
    title: 'Business Unit',
    type : 'basic',
    icon : 'heroicons_outline:briefcase',
    link : '/admin/businessunit'
    },
    {
  id   : '3',
  title: 'Master',
  type : 'basic',
  icon : 'heroicons_outline:globe-alt',
  link : '/admin/master'
  }
];

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  // @ViewChild('drawer') drawer: MatDrawer;

  menuData: FuseNavigationItem[] = [];
  private _masterMenuData: FuseNavigationItem[] = [];
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isHoveredBackBtn = false;

    public currentSelection ="Managers";

    /**
     * Constructor
     */
    constructor(private _fuseMediaWatcherService: FuseMediaWatcherService, private _fuseNavigationService: FuseNavigationService, private location : Location)
    {
      masterMenu.map(each => {
        this._masterMenuData.push(each)
      })
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      this._updateMenuData()
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    changeCurrentSelection(selectedValue:string){
      this.currentSelection=selectedValue;
    }

    

    private _updateMenuData(): void
    {
        this.menuData = [
            {
                title   : 'Admin',
                type    : 'group',
                children: [
                    ...masterMenu
                ]
            }
        ];
    }

    onBack(){
      this.location.back();
    }

}

