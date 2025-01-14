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
  closeUpgrade() {
    this.isOpen = false;
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private campaignService: CampaignsService
  ) {}
  logout(): void {
    this.authService.logout(); // Clear session
    this.router.navigate(['/login']); // Redirect to login
    localStorage.clear(); // Clear storage on logout
  }
  ngOnInit(): void {
    this.userName = localStorage.getItem('userName'); // Retrieve name
    this.userEmail = localStorage.getItem('userEmail'); // Retrieve email
    // Retrieve accountId from cookies
    const accountIdFromCookie = this.cookieService.get('accountId'); // Assuming the cookie name is 'accountId'

    // Check if accountId exists in cookies
    if (accountIdFromCookie) {
      const accountId = accountIdFromCookie; // Use accountId as string

      this.campaignService.getCampaignCounts(accountId).subscribe(
        (data) => {
          this.counts = data.counts;
          console.log('Campaign counts:', data); // Handle the campaign counts data
        },
        (error) => {
          console.error('Error fetching campaign counts:', error); // Handle error
        }
      );
    } else {
      console.error('Account ID not found in cookies.');
    }
  }
}
