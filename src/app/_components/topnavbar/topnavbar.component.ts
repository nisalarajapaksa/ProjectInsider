import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '@app/_models';
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
    user: User;

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

    }

    logout() {
        this.authenticationService.logout();
        this.menuService.clearMenu()
        this.router.navigate(['/login']);
    }
}