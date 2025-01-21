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
  userName: string = ''; // Initialize with an empty string
  userEmail: string = ''; // Initialize with an empty string
  account_id: string = ''; // Initialize account_id
  counts: any;
  userData: any;
  loading: boolean = false;

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
    // Fetch user data once
    this.authService.fetchUserData().subscribe({
      next: (response) => {
        this.userData = response;
        const user = response?.user;
        if (user) {
          const accountId = user.account_id;
          this.userName = user.username || ''; // Assign username
          this.userEmail = user.email || ''; // Assign email

          // Store data in localStorage
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('userEmail', this.userEmail);
          localStorage.setItem('accountId', accountId.toString()); // Use accountId for storage

          // Set accountId in cookies
          this.cookieService.set('accountId', accountId.toString());

          // Load campaign counts using accountId
          this.loadCampaignCounts(accountId.toString());
        } else {
          console.error('User data not found.');
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.router.navigate(['/login']);
      },
    });
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
