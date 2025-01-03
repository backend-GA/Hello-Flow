import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [TableModule],
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
}
