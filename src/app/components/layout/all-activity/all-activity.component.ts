import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { CampaignsService } from '../../../services/campaigns.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-activity.component.html',
  styleUrl: './all-activity.component.scss',
})
export class AllActivityComponent {
  recentActivities: any[] = [];

  constructor(
    private cookieService: CookieService,
    private CampaignsService: CampaignsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.AllActivity();
  }
  AllActivity() {
    const accountId = this.cookieService.get('account_id'); // Retrieve account ID from cookies
    if (!accountId) {
      console.error('Account ID is missing in cookies.');
      return;
    }

    this.CampaignsService.GetrecentActivityinPage(Number(accountId)).subscribe({
      next: (data) => {
        this.recentActivities = data.records;
        console.log('Recent Activity:', this.recentActivities);
      },
      error: (err) => {
        console.error('Error fetching recent activity:', err.message || err);
      },
    });
  }
}
