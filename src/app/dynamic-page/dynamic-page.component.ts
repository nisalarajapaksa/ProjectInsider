import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '@app/_services';

import { User, Menu } from '@app/_models';

@Component({ templateUrl: 'dynamic-page.component.html' })
export class DynamicPageComponent implements OnInit {
    currentUser: User;
    currentUserSubscription: Subscription;
    menu: Menu;
    pageTitle: String;
    menuId: Number;
    moduleId: Number;

    constructor(
        private route: ActivatedRoute,
        private menuService: MenuService
    ) {
        this.route.queryParams.subscribe(params => {
            this.moduleId = params.moduleId,
            this.menuId = params.menuId,
            this.setPageData()
        });
    }

    ngOnInit() {
        
    }

    setPageData() {
        this.menu = this.menuService.currentMenuValue as Menu;
        this.menu['responseObject'].map(item => {
            // console.log('item', this.menuId)
            if (item.MenuId == this.menuId) {
                // console.log('item.MenuName', item)
                this.pageTitle = item.MenuName
                return 
            }
        })
    }
}