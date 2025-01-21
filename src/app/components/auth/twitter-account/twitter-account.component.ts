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
    const accountIdFromCookie = this.cookieService.get('accountId');

    // لو الـ account_id فاضي، نعمل تحديث للـ account_id بناءً على الـ "me" endpoint
    if (!accountIdFromCookie) {
      this.authService.fetchUserData().subscribe({
        next: (response) => {
          const accountId = response?.user?.account_id;
          if (accountId) {
            // تحديث الـ account_id في الـ Cookie و localStorage
            this.cookieService.set('accountId', accountId.toString());
            localStorage.setItem('accountId', accountId.toString());
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
    }
  }
}
