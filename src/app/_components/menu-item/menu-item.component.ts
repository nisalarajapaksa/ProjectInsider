import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { MenuResponseObject } from '@app/_models';

@Component({
    selector: 'menu-item',
    templateUrl: 'menu-item.component.html'
    // encapsulation: ViewEncapsulation.None
    // styleUrls: ['menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
    @Input() subMenuItems: MenuResponseObject[];
    @Input() superId: number;
    // @ViewChild('menu-item') public childMenu;
    // @ViewChild('childMenu') public childMenu;
  
    constructor(public router: Router) {
    }
  
    ngOnInit() {
    }

    public filterMenuByModule(responseObject: MenuResponseObject[], moduleId: number):MenuResponseObject[]{
        let filteredArray = responseObject.filter(function(arrayItem) {
            return arrayItem.ModuleId == moduleId;
        });
        return filteredArray;
    }

    public filterMenuByUnderMenu(responseObject: MenuResponseObject[], underMenuId:number):MenuResponseObject[]{
        let filteredArray = responseObject.filter(function(arrayItem) {
            return arrayItem.UnderMenuId == underMenuId;
        });
        return filteredArray;
    }
  }