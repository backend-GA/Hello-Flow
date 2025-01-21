import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { TwitterAccountService } from '../../../services/twitter-account.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CampaignsService } from '../../../services/campaigns.service';

@Component({
  selector: 'app-twitter-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './twitter-account.component.html',
  styleUrl: './twitter-account.component.scss',
})
export class TwitterAccountComponent {
  twitterAccounts: any; // Array to hold the Twitter account data
  errorMessage: string = ''; // Variable to store error messages
  userName: string = ''; // Initialize with an empty string
  userEmail: string = ''; // Initialize with an empty string
  account_id: string = ''; // Initialize account_id
  counts: any;
  loading: boolean = false;
  userData: any;
  constructor(
    private authService: AuthService,
    private TwitterAccountService: TwitterAccountService,
    private router: Router,
    private cookieService: CookieService,
    private campaignService: CampaignsService
  ) {}

  loadTwitterAccounts(): void {
    this.TwitterAccountService.getTwitterAccounts().subscribe({
      next: (response) => {
        this.twitterAccounts = response; // Store the response data
        console.log('Twitter Accounts:', this.twitterAccounts); // Log for debugging
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load Twitter accounts. Please try again.';
        console.error('Error:', error); // Log the error for debugging
      },
    });
  }

  ngOnInit(): void {
    this.loadTwitterAccounts();
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
}
