import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TwitterAccountService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // getTwitterAccounts(): Observable<any> {
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   });

  //   return this.http.get<any>(`${environment.apiUrl}accounts/twitter`, {
  //     headers,
  //   });
  // }
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
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${environment.apiUrl}accounts/twitter`, {
      headers,
    });
  }
  getTwitterAccounts(headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}accounts/twitter`, {
      headers,
    });
  }
}
