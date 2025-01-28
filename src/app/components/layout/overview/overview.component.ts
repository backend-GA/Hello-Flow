import { ChartModule } from 'primeng/chart';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CookieService } from 'ngx-cookie-service';
import { CampaignsService } from '../../../services/campaigns.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [ChartModule, AutoComplete, FormsModule, TableModule, CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent {
  data: any;
  userName: string | null = '';
  options: any;
  showComingSoon = false;
  recentActivity: any[] = [];

  value = 'Justice Campaign';
  suggestions: string[] = []; // Should be an array
  platformId = inject(PLATFORM_ID);
  Active_Campaigns: any[] = [
    {
      name: 'Active Campaigns',
      like: 91,
      Comments: 1012,
    },
    {
      code: 'Twitter (X)',
      name: '#Masterclass2029',
      like: '2512',
      Comments: 1012,
      share: 91,
    },
    {
      code: 'Tiktok',
      name: '#Masterclass2029',
      like: '2512',
      Comments: 1012,
      share: 91,
    },

    // Add more campaigns as needed
  ];
  constructor(
    private cd: ChangeDetectorRef,
    private cookieService: CookieService,
    private CampaignsService: CampaignsService
  ) {}

  showMessage() {
    this.showComingSoon = !this.showComingSoon; // Toggle the visibility
  }
  ngOnInit() {
    this.initChart();

    this.userName = localStorage.getItem('userName'); // Retrieve name
    this.userName = this.cookieService.get('userName'); // Retrieve name from cookies
    this.getAllCookies(); //
    this.fetchRecentActivity();
  }
  getAllCookies() {
    const allCookies = this.cookieService.getAll();
    console.log('All Cookies:', allCookies); // Display all cookies
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color'
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color'
      );

      this.data = {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            type: 'bar',
            label: 'Dataset 1',
            backgroundColor: documentStyle.getPropertyValue('--p-emerald-950'),
            data: [2000, 3500, 5000, 9000, 8000, 10000, 12000],
          },
          {
            type: 'bar',
            label: 'Dataset 2',
            backgroundColor: documentStyle.getPropertyValue('--p-slate-200'),
            data: [4000, 5000, 13000, 16000, 17000, 18000, 2000],
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  updateTokenInCookies(token: string) {
    this.cookieService.set('authToken', token, 1, '/'); // Set token with 7-day expiry
  }

  fetchRecentActivity(): void {
    const accountId = this.cookieService.get('account_id'); // Retrieve account ID from cookies

    if (!accountId) {
      console.error('Account ID is missing in cookies.');
      return;
    }

    // Call the service method to fetch recent activity
    this.CampaignsService.GetrecentActivity(Number(accountId)).subscribe({
      next: (data) => {
        this.recentActivity = data.records; // Assign the fetched data
        console.log('Recent Activity:', this.recentActivity);
      },
      error: (err) => {
        // Enhanced error logging for debugging
        console.error('Error fetching recent activity:', err.message || err);
      },
    });
  }
}
