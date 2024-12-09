import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private userService: UserService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.setCurrentUser();
    }

    setCurrentUser() {
        const userString = localStorage.getItem("horolog-user");
        if (!userString) return;

        const user = JSON.parse(userString);

        this.userService.currentUser.set(user);
    }
}
