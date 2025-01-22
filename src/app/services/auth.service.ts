import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenName = 'auth_token';

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
  private tokenKey = 'token';

  saveToken(token: string): void {
    this.cookieService.set('token', token); // Or store in any other way you want
  }

  getToken(): string | null {
    return this.cookieService.get('token');
  }
  updateToken(newToken: string): void {
    this.saveToken(newToken);
  }

  fetchUserData(): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this._HttpClient.get(`${environment.apiUrl}auth/me`, { headers });
  }
}
