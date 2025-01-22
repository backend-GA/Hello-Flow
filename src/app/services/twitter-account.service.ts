import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TwitterAccountService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService
  ) {}

  getTwitterAccounts(): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${environment.apiUrl}accounts/twitter`, {
      headers,
    });
  }
  getPlans(): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${environment.apiUrl}payments/plans`, {
      headers,
    });
  }
  createPlan(planId: number, price: number): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      planId: planId, // Send the selected planId
      price: price,
    };

    return this.http.post<any>(
      `${environment.apiUrl}payments/subscriptions`,
      body,
      { headers }
    );
  }
  getsubScriptions(): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${environment.apiUrl}payments/subscriptions`, {
      headers,
    });
  }
  getAccountsTwitter(): Observable<any> {
    const token = this.authService.getToken(); // Get the latest token
    if (!token) {
      console.error('No token found. Please log in again.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(
      `${environment.apiUrl}twitter-accounts`, // Adjust this with your actual endpoint
      { headers }
    );
  }
}
