import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
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

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private menuService: MenuService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
        this.loadMenu();
        if (this.menu == null) {
            this.menuService.getMenu(this.currentUser.AppAccessID.toString(), this.currentUser.Key.toString(), this.currentUser.CompanyID.toString()).pipe(first())
                .subscribe(
                    data => {
                        this.menu = data as Menu;
                        this.menuItemNodes = this.filterNodeMenuItems();
                        console.log(this.menu);
                        console.log(this.menuItemNodes);
                    },
                    error => {
                        console.log("Menu API Error");
                    });
        }
        else{
            this.menuItemNodes = this.filterNodeMenuItems();
            console.log(this.menu);
            console.log(this.menuItemNodes);
        }
    }

    public filterMenuByModule(moduleId:number):MenuResponseObject[]{
        let filteredArray = this.menu.responseObject.filter(function(arrayItem) {
            return arrayItem.ModuleId == moduleId;
        });
        return filteredArray;
    }

    public filterMenuByUnderMenu(underMenuId:number):MenuResponseObject[]{
        let filteredArray = this.menu.responseObject.filter(function(arrayItem) {
            return arrayItem.UnderMenuId == underMenuId;
        });
        return filteredArray;
    }

    private loadMenu() {
        this.menu = this.menuService.currentMenuValue;
    }

    private filterNodeMenuItems():MenuResponseObject[]{
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
        this.router.navigate(['/dynamic'], { queryParams: { moduleId: item.ModuleId } });
    }
}