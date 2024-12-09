import { Component } from '@angular/core';
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
    errorMessage: string;

    constructor(
        public layoutService: LayoutService,
        private userService: UserService,
        private toastService: ToastService
    ) { }

    onLogin() {
        this.userService.login({ username: this.username, password: this.password }).subscribe({
            error: () => this.errorMessage = "Invalid username or password"
        });
    }
}
