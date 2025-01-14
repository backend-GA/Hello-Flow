import { Component } from '@angular/core';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-active-campaigns',
  standalone: true,
  imports: [],
  templateUrl: './active-campaigns.component.html',
  styleUrl: './active-campaigns.component.scss',
})
export class ActiveCampaignsComponent {
  constructor(
    private campaignService: CampaignsService,
    private cookieService: CookieService // Inject the CookieService
  ) {}

  ngOnInit(): void {
    // Retrieve accountId from cookies
    const accountIdFromCookie = this.cookieService.get('accountId'); // Assuming the cookie name is 'accountId'

    // Check if accountId exists in cookies
    if (accountIdFromCookie) {
      const accountId = Number(accountIdFromCookie); // Convert to a number

      this.campaignService.getActiveCampaigns(accountId).subscribe(
        (data) => {
          console.log(data); // Handle active campaigns data
        },
        (error) => {
          console.error('Error fetching active campaigns:', error); // Handle error
        }
      );
    } else {
      console.error('Account ID not found in cookies.');
    }
  }
}
