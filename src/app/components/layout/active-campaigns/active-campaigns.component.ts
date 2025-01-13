import { Component } from '@angular/core';
import { CampaignsService } from '../../../services/campaigns.service';

@Component({
  selector: 'app-active-campaigns',
  standalone: true,
  imports: [],
  templateUrl: './active-campaigns.component.html',
  styleUrl: './active-campaigns.component.scss',
})
export class ActiveCampaignsComponent {
  private accountId: string = '6'; // Replace with dynamic ID if needed

  constructor(private campaignService: CampaignsService) {}
  ngOnInit(): void {
    const accountId = '6'; // Replace with a dynamic value if necessary
    this.campaignService.getActiveCampaigns(accountId).subscribe(
      (data) => {
        console.log(data); // Handle active campaigns data
      },
      (error) => {
        console.error('Error fetching active campaigns:', error); // Handle error
      }
    );
  }
}
