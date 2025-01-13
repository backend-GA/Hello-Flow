import { Component } from '@angular/core';
import { TwitterAccountService } from '../../../services/twitter-account.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})
export class PlansComponent {
  plans: any[] = [];

  constructor(
    private TwitterAccountService: TwitterAccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.TwitterAccountService.getPlans().subscribe(
      (data: any) => {
        this.plans = data.plans;
        console.log(this.plans);
      },
      (error) => {
        console.error('Error fetching plans:', error);
      }
    );
  }

  createPlan(planId: number, price: number) {
    this.TwitterAccountService.createPlan(planId, price).subscribe(
      (response) => {
        console.log('Plan created successfully:', response);
        window.location.href = response.url; // Navigate to the checkout URL
      },
      (error) => {
        console.error('Error creating plan:', error);
        this.router.navigate(['/twitter-account']);
      }
    );
  }
}
