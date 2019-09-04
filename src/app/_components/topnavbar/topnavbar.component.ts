import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { BehaviorSubject, Observable } from 'rxjs';

import { User, Menu } from '@app/_models';
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
                        console.log(this.menu);
                    },
                    error => {
                        console.log("Menu API Error");
                    });
        }

        console.log('this.menu ', this.menu)
    }

    private loadMenu() {
        this.menu = this.menuService.currentMenuValue;
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