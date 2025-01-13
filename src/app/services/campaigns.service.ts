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

  createCampaign(accountId: string): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this._HttpClient.get<any>(
      `${environment.apiUrl}accounts/${accountId}/campaigns`,
      {
        headers,
      }
    );
  }

  getPastCampaign(
    accountId: string,
    active: boolean = false,
    draft: boolean = false
  ): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const params = new HttpParams()
      .set('active', active.toString())
      .set('draft', draft.toString());

    return this._HttpClient.get<any>(
      `${environment.apiUrl}accounts/${accountId}/campaigns`,
      {
        headers,
        params,
      }
    );
  }
  getActiveCampaigns(accountId: string): Observable<any> {
    const token = this.cookieService.get('token'); // Retrieve token from cookies
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const params = new HttpParams().set('active', 'true').set('draft', 'false');

    return this._HttpClient.get<any>(
      `${environment.apiUrl}accounts/6/campaigns`,
      {
        headers,
        params,
      }
    );
  }
}
