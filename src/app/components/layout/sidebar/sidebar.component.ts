import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { CampaignsService } from '../../../services/campaigns.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host: { ngSkipHydration: 'true' },
})
export class SidebarComponent {
  isOpen: boolean = true;
  userName: string | null = '';
  userEmail: string | null = '';
  counts: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private campaignService: CampaignsService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.clear();
  }

  ngOnInit(): void {
    const accountIdFromCookie = this.cookieService.get('accountId');

    if (accountIdFromCookie) {
      this.loadCampaignCounts(accountIdFromCookie);
    } else {
      this.authService.fetchUserData().subscribe({
        next: (response) => {
          const accountId = response?.user?.account_id;
          if (accountId) {
            this.cookieService.set('accountId', accountId.toString());
            this.loadCampaignCounts(accountId);
          } else {
            console.error('Account ID not found in user data.');
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
          this.router.navigate(['/login']);
        },
      });
    }
    this.userName = localStorage.getItem('userName'); // Retrieve name
    this.userEmail = localStorage.getItem('userEmail'); // Retrieve name
  }

  private loadCampaignCounts(accountId: string): void {
    this.campaignService.getCampaignCounts(accountId).subscribe({
      next: (data) => {
        console.log('Full campaign data response:', data);
        this.counts = data?.counts;
      },
      error: (error) => {
        console.error('Error fetching campaign counts:', error);
      },
    });
  }
  closeUpgrade() {
    this.isOpen = false;
  }
}
