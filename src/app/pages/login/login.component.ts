import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastService } from 'src/app/layout/service/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    username!: string;
    password!: string;
    showErrorMessage = false;

    constructor(
        public layoutService: LayoutService,
        private userService: UserService,
        private router: Router
    )
    { 
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.isLoading$ = this.isLoadingSubject.asObservable();

        if (this.userService.currentUser()) this.router.navigate(['/']);
    }

    private isLoadingSubject: BehaviorSubject<boolean>;
    isLoading$: Observable<boolean>;

    onLogin() {
        this.isLoadingSubject.next(true);

        this.userService.login({ username: this.username, password: this.password }).subscribe({
            error: () => {
                this.isLoadingSubject.next(false);
                this.showErrorMessage = true;
            }
        });
    }
}
