import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  constructor(
    private _HttpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  createCampaign(accountId: number, payload: any): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this._HttpClient.post<any>( // POST request should be used for creation
      `${environment.apiUrl}accounts/${accountId}/campaigns`,
      payload,
      {
        headers,
      }
    );
  }

  getPastCampaign(
    accountId: number, // Ensure accountId is a number
    active: boolean = false,
    draft: boolean = false
  ): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Construct query parameters dynamically
    const params = new HttpParams()
      .set('active', active.toString()) // Use method parameters
      .set('draft', draft.toString());

    return this._HttpClient.get<any>(
      `${environment.apiUrl}accounts/${accountId}/campaigns`, // Use base URL without hardcoded query params
      {
        headers,
        params, // Automatically appends the correct query params
      }
    );
  }

  getActiveCampaigns(accountId: number): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const params = new HttpParams().set('active', 'true').set('draft', 'false');

    return this._HttpClient.get<any>(
      `${environment.apiUrl}accounts/${accountId}/campaigns?active=true&draft=false`, // Use dynamic accountId here
      {
        headers,
        params,
      }
    );
  }

  getCampaignCounts(accountId: string): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this._HttpClient.get<any>(
      `${environment.apiUrl}accounts/${accountId}/campaigns/counts`, // The new endpoint
      {
        headers,
      }
    );
  }
  getDraft(accountId: string, draft: boolean = true): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const params = new HttpParams().set('draft', draft.toString()); // Add the draft query parameter

    return this._HttpClient.get<any>(
      `${environment.apiUrl}accounts/${accountId}/campaigns`,
      {
        headers,
        params,
      }
    );
  }
  deleteCampaign(accountId: string, campaignId: string): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this._HttpClient.delete<any>(
      `${environment.apiUrl}accounts/${accountId}/campaigns/${campaignId}`,
      {
        headers,
      }
    );
  }
  updateCampaign(
    accountId: string | number,
    campaignId: string | number,
    payload: any
  ): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this._HttpClient.patch<any>(
      `${environment.apiUrl}accounts/${accountId}/campaigns/${campaignId}`, // Ensure the endpoint is correct
      payload,
      { headers }
    );
  }
}
