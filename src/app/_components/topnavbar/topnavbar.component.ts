import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// import { BehaviorSubject, Observable } from 'rxjs';

import { User, Menu, MenuResponseObject } from '@app/_models';
import { AuthenticationService, MenuService } from '@app/_services';

@Component({
    selector: 'topnavbar',
    templateUrl: 'topnavbar.component.html'
})

export class TopNavBarComponent implements OnInit {
    private subscription: Subscription;
    message: any;
    currentUser: User;
    currentUserSubscription: Subscription;
    menu: Menu;
    menuItemNodes: MenuResponseObject[];
    menuNames: String[];
    moduleId: Number;
    menuId: Number;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private menuService: MenuService,
        private route: ActivatedRoute,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

        this.route.queryParams.subscribe(params => {
            if (params) {
                this.moduleId = params.moduleId
                this.menuId = params.menuId
            }
        });
    }

    ngOnInit() {
        if(!this.currentUser) {
            return
        }

        if (this.menu == undefined) {
            this.menuService.getMenu(this.currentUser.AppAccessID.toString(), this.currentUser.Key.toString(), this.currentUser.CompanyID.toString()).pipe(first())
                .subscribe(
                    data => {
                        this.menu = data as Menu;
                        this.menuItemNodes = this.filterNodeMenuItems();
                        // console.log(this.menu);
                        // console.log(this.menuItemNodes);
                        this.menuNames = this.menuItemNodes.map(item => item.MenuName)
                    },
                    error => {
                        console.log("Menu API Error");
                    });
        }
        else {
            this.menuItemNodes = this.filterNodeMenuItems();
            this.menuNames = this.menuItemNodes.map(item => item.MenuName)
            // console.log(this.menu);
            // console.log('menuItemNodes', this.menuItemNodes.map(item => item.MenuName));
        }
    }

    public filterMenuByModule(moduleId: number): MenuResponseObject[] {
        let filteredArray = this.menu.responseObject.filter(function (arrayItem) {
            return arrayItem.ModuleId == moduleId;
        });
        return filteredArray;
    }

    public filterMenuByUnderMenu(underMenuId: number): MenuResponseObject[] {
        let filteredArray = this.menu.responseObject.filter(function (arrayItem) {
            return arrayItem.UnderMenuId == underMenuId;
        });
        return filteredArray;
    }

    private loadMenu() {
        this.menu = this.menuService.currentMenuValue;
    }

    private filterNodeMenuItems(): MenuResponseObject[] {
        let filteredArray = this.menu.responseObject.filter((arrayItem) => {
            return this.filterMenuByUnderMenu(arrayItem.MenuId).length == 0;
        });
        return filteredArray;
    }

    logout() {
        this.authenticationService.logout();
        this.menuService.clearMenu()
        this.router.navigate(['/login']);
    }

    navigateTo(item) {
        this.router.navigate(['/dynamic'], { queryParams: { moduleId: item.ModuleId, menuId: item.MenuId } });
    }

    searchInput(e) {
        if(e.target.value) {
            this.navigateTo(this.menuItemNodes.find(item => item.MenuName == e.target.value))
        }
    }
}