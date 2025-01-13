import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TwitterAccountService } from '../../../services/twitter-account.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [TableModule, CommonModule, RouterLink],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
})
export class BillingComponent {
  data: any;
  options: any;
  value = 'Justice Campaign';
  suggestions: string[] = []; // Should be an array
  platformId = inject(PLATFORM_ID);
  plans: any[] = [
    {
      code: 'January 15, 2023',
      name: 'Pro PLan',
      like: '$17.91',
    },
    {
      code: 'January 15, 2023',
      name: 'Pro PLan',
      like: '$17.91',
    },
    {
      code: 'January 15, 2023',
      name: 'Pro PLan',
      like: '$17.91',
    },

    // Add more campaigns as needed
  ];
  subscriptions: any;

  constructor(private TwitterAccountService: TwitterAccountService) {}

  ngOnInit(): void {
    this.fetchSubscriptions();
  }

  fetchSubscriptions(): void {
    this.TwitterAccountService.getsubScriptions().subscribe(
      (response: any) => {
        this.subscriptions = response.subscriptions; // Adjust depending on the structure
        console.log('Subscriptions:', this.subscriptions);
      },
      (error) => {
        console.error('Error fetching subscriptions:', error);
      }
    );
  }
}
