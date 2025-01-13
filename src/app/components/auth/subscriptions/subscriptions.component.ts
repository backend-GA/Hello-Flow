import { Component } from '@angular/core';
import { TwitterAccountService } from '../../../services/twitter-account.service';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss',
})
export class SubscriptionsComponent {
  subscriptions: any[] = [];

  constructor(private TwitterAccountService: TwitterAccountService) {}

  ngOnInit(): void {
    this.fetchSubscriptions();
  }

  fetchSubscriptions(): void {
    this.TwitterAccountService.getsubScriptions().subscribe(
      (response) => {
        this.subscriptions = response; // Adjust depending on the structure
        console.log('Subscriptions:', this.subscriptions);
      },
      (error) => {
        console.error('Error fetching subscriptions:', error);
      }
    );
  }
}
