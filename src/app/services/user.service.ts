import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { User } from '../models/user';
import { map } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${env.baseApiUrl}/api/users`;
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any) {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      map(user => {
        if (user) {
          localStorage.setItem("horolog-user", JSON.stringify(user));
          this.currentUser.set(user);
          this.router.navigate(['/']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem("horolog-user");
    this.currentUser.set(null);
  }
}
