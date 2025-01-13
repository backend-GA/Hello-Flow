import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { TwitterAccountService } from '../../../services/twitter-account.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    private authService: AuthService,
    private TwitterAccountService: TwitterAccountService
  ) {}

  ngOnInit(): void {
    this.loadTwitterAccounts();
  }

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
}
