import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '@app/_services';

import { User, Menu } from '@app/_models';

@Component({ templateUrl: 'dynamic-page.component.html' })
export class DynamicPageComponent implements OnInit, OnChanges {
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
        });
    }

    ngOnInit() {
        this.menu = this.menuService.currentMenuValue as Menu;
        this.menu['responseObjectMod'].map(item => {
            if (item.ModuleId == this.moduleId) {
                this.pageTitle = item.ModuleName
            }
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes)
    }
}