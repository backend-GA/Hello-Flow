import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _HttpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this._HttpClient.post<any>(`${environment.apiUrl}auth/login`, data);
  }
  register(data: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this._HttpClient.post<any>(
      `${environment.apiUrl}auth/register`,
      data
    );
  }
  logout(): void {
    localStorage.removeItem('token'); // Example for localStorage
    sessionStorage.clear(); // Clear session storage
    this.cookieService.deleteAll(); // Clear cookies if necessary
  }
}
