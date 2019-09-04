import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '@app/_models';
import { UserService, AuthenticationService, MenuService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    user: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private menuService: MenuService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
        this.loadAllUsers();
        console.log(this.user);
        //this.menuService.GetMenu(this.user.AppAccessID.toString(), this.user.Key.toString(), this.user.CompanyID.toString()).pipe(first())
        this.menuService.GetMenu("1", "QJ", "1").pipe(first())
        .subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log("Menu API Error");
            });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    deleteUser(id: number) {
        // this.userService.delete(id).pipe(first()).subscribe(() => {
        //     this.loadAllUsers()
        // });
    }

    private loadAllUsers() {
        this.user = this.userService.currentUserValue;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}