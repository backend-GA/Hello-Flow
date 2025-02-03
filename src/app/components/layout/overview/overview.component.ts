import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CampaignsService } from '../../../services/campaigns.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { AutoComplete } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [ChartModule, AutoComplete, FormsModule, TableModule, CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent implements OnInit {
  data: any;
  userName: string | null = '';
  options: any;
  showComingSoon = false;
  selectedCampaign: any = null; // Define selectedCampaign to hold the selected campaign object

  recentActivity: any[] = [];
  account_id?: number;
  credits: string = '0';
  remainingCredits: string = '0';
  usedCredits: string = '0';
  campaigns: any; // Store search campaign results
  campaignID: any;
  value = 'Justice Campaign';
  suggestions: string[] = []; // Should be an array
  platformId = inject(PLATFORM_ID);
  ActiveCampaigns: any;
  userData: any;
  constructor(
    private cd: ChangeDetectorRef,
    private cookieService: CookieService,
    private CampaignsService: CampaignsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initChart();

    this.userName = this.cookieService.get('userName'); // Retrieve name from cookies
    this.credits = this.cookieService.get('credits');
    this.remainingCredits = this.cookieService.get('remainingCredits');
    this.usedCredits = this.cookieService.get('usedCredits');
    this.getAllCookies();
    this.fetchRecentActivity();
    this.getActiveCampaigns();
    this.getSarche();
    this.authService.fetchUserData().subscribe({
      next: (response) => {
        this.userData = response;
        const user = response;
        if (user) {
          const account_id = user.account_id;
          this.userName = user.username || '';
          this.usedCredits = this.usedCredits;
          this.remainingCredits = this.remainingCredits;
          this.credits = this.credits;
        }
      },
      error: (error) => {},
    });
  }

  getAllCookies() {
    const allCookies = this.cookieService.getAll();
    console.log('All Cookies:', allCookies); // Display all cookies
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
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
          tooltip: { mode: 'index', intersect: false },
          legend: {
            labels: { color: documentStyle.getPropertyValue('--p-text-color') },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: documentStyle.getPropertyValue('--p-text-muted-color'),
            },
            grid: {
              color: documentStyle.getPropertyValue('--p-content-border-color'),
              drawBorder: false,
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: documentStyle.getPropertyValue('--p-text-muted-color'),
            },
            grid: {
              color: documentStyle.getPropertyValue('--p-content-border-color'),
              drawBorder: false,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  fetchRecentActivity() {
    const accountId = this.cookieService.get('account_id'); // Retrieve account ID from cookies
    if (!accountId) {
      console.error('Account ID is missing in cookies.');
      return;
    }

    this.CampaignsService.GetrecentActivity(Number(accountId)).subscribe({
      next: (data) => {
        this.recentActivity = data.records;
        console.log('Recent Activity:', this.recentActivity);
      },
      error: (err) => {
        console.error('Error fetching recent activity:', err.message || err);
      },
    });
  }

  getActiveCampaigns() {
    const accountIdFromCookie = this.cookieService.get('account_id');
    if (accountIdFromCookie) {
      this.account_id = Number(accountIdFromCookie);
      this.CampaignsService.getActiveCampaigns(this.account_id).subscribe(
        (data) => {
          this.ActiveCampaigns = data.campaigns.slice(0, 3);
          console.log('Active Campaigns:', this.ActiveCampaigns);
        },
        (error) => {
          console.error('Error fetching active campaigns:', error);
        }
      );
    } else {
      console.error('Account ID not found in cookies.');
    }
  }

  getSarche() {
    const accountId = Number(this.cookieService.get('account_id')); // Retrieve accountId from cookies
    if (!accountId) {
      console.error('Account ID is missing or invalid');
      return;
    }

    this.CampaignsService.getSearchCam(accountId).subscribe({
      next: (response) => {
        this.campaigns = response.campaigns; // Store campaigns array
        if (this.campaigns.length > 0) {
          this.campaignID = this.campaigns[0].id;
          this.selectedCampaign = this.campaigns[0];
        }
        console.log('Campaign ID:', this.campaignID);
      },
      error: (err) => {
        console.error('Error fetching search campaigns:', err);
      },
    });
  }

  onCampaignSelect(selectedCampaign: any) {
    const accountId = Number(this.cookieService.get('account_id')); // Retrieve accountId from cookies
    if (!accountId) {
      console.error('Account ID is missing or invalid');
      return;
    }
    if (!selectedCampaign || !selectedCampaign.id) {
      console.error('Invalid campaign selected:', selectedCampaign);
      return;
    }

    const campaignId = selectedCampaign.id; // Get the selected campaign's ID
    console.log('Selected Campaign ID:', campaignId);

    // Call the getCampaignById method from the service
    this.CampaignsService.getCampaignById(accountId, campaignId).subscribe({
      next: (response) => {
        console.log('Campaign Details:', response);
        // Handle the response here
      },
      error: (err) => {
        console.error('Error fetching campaign details:', err);
      },
    });
  }
}
