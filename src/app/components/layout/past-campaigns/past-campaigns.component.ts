import { Component } from '@angular/core';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-past-campaigns',
  standalone: true,
  imports: [],
  templateUrl: './past-campaigns.component.html',
  styleUrl: './past-campaigns.component.scss',
})
export class PastCampaignsComponent {
  private accountId?: number; // accountId type as number

  constructor(
    private campaignService: CampaignsService,
    private cookieService: CookieService // Inject the CookieService
  ) {}

  ngOnInit(): void {
    // Retrieve accountId from cookies
    const accountIdFromCookie = this.cookieService.get('accountId'); // Assuming the cookie name is 'accountId'

    // Convert to a number and assign it to the accountId property
    this.accountId = Number(accountIdFromCookie);

    if (this.accountId) {
      this.campaignService.getPastCampaign(this.accountId).subscribe(
        (data) => {
          console.log(data); // Handle campaign data
        },
        (error) => {
          console.error('Error fetching campaigns:', error); // Handle error
        }
      );
    } else {
      console.error('Account ID not found in cookies.');
    }
  }
}
