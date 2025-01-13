import { Component } from '@angular/core';
import { CampaignsService } from '../../../services/campaigns.service';

@Component({
  selector: 'app-past-campaigns',
  standalone: true,
  imports: [],
  templateUrl: './past-campaigns.component.html',
  styleUrl: './past-campaigns.component.scss',
})
export class PastCampaignsComponent {
  private accountId: string = '1744475924144209920'; // Replace with dynamic ID if needed

  constructor(private campaignService: CampaignsService) {}

  ngOnInit(): void {
    this.campaignService.getPastCampaign(this.accountId).subscribe(
      (data) => {
        console.log(data); // Handle campaign data
      },
      (error) => {
        console.error('Error fetching campaigns:', error); // Handle error
      }
    );
  }
}
