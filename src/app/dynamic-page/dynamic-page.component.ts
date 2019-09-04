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
    moduleId: Number;

    constructor(
        private route: ActivatedRoute,
        private menuService: MenuService
    ) {
        this.route.queryParams.subscribe(params => {
            this.moduleId = params.moduleId
            this.setPageData()
        });
    }

    ngOnInit() {
        
    }

    setPageData() {
        this.menu = this.menuService.currentMenuValue as Menu;
        this.menu['responseObjectMod'].map(item => {
            if (item.ModuleId == this.moduleId) {
                this.pageTitle = item.ModuleName
            }
        })
    }
}