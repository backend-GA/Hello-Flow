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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    ChartModule,
    AutoComplete,
    FormsModule,
    TableModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent implements OnInit {
  data: any;
  userName: string | null = '';
  options: any;
  showComingSoon = false;
  selectedCampaign: any = null;
  recentActivity: any[] = [];
  account_id?: number;
  credits: string = '0';
  remainingCredits: string = '0';
  usedCredits: string = '0';
  campaigns: any[] = [];
  campaignID: any;
  value = 'Justice Campaign';
  suggestions: string[] = [];
  platformId = inject(PLATFORM_ID);
  ActiveCampaigns: any[] = [];
  userData: any;
  likesCount: number = 0;
  commentsCount: number = 0;
  creditsline: number = 0;
  months: Record<
    string,
    { likes: number; comments: number; consumedCredits: number }
  > = {};
  labels: string[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private cookieService: CookieService,
    private CampaignsService: CampaignsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initChart();
    this.loadCookies();
    this.fetchRecentActivity();
    this.getActiveCampaigns();
    this.getSearchCampaigns();
    this.fetchUserData();
  }

  loadCookies() {
    this.userName = this.cookieService.get('userName') || '';
    this.credits = this.cookieService.get('credits') || '0';
    this.remainingCredits = this.cookieService.get('remainingCredits') || '0';
    this.usedCredits = this.cookieService.get('usedCredits') || '0';
    console.log('All Cookies:', this.cookieService.getAll());
  }

  fetchUserData() {
    this.authService.fetchUserData().subscribe({
      next: (response) => {
        this.userData = response;
        if (response) {
          this.account_id = response.account_id;
          this.userName = response.username || '';
          this.creditsline = response.credits || 0;
        }
      },
      error: (error) => console.error('Error fetching user data:', error),
    });
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);

      this.data = {
        labels: this.labels,
        datasets: [
          {
            type: 'bar',
            label: 'Likes',
            backgroundColor: documentStyle.getPropertyValue('--p-emerald-950'),
            data: this.labels.map((month) => this.months[month]?.likes || 0),
            borderRadius: 8,
          },
          {
            type: 'bar',
            label: 'Comments',
            backgroundColor: documentStyle.getPropertyValue('--p-slate-200'),
            data: this.labels.map((month) => this.months[month]?.comments || 0),
            borderRadius: {
              topLeft: 8,
              topRight: 8,
              bottomLeft: 0,
              bottomRight: 0,
            },
          },
          {
            type: 'line',
            label: 'Credits',
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: 'red',
            borderWidth: 2,
            spanGaps: false,
            data: this.labels.map(() => this.creditsline || 0),
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
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
              display: false, // إخفاء الخطوط العمودية فقط
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: documentStyle.getPropertyValue('--p-text-muted-color'),
            },
            grid: {
              display: true, // تبقى الخطوط الأفقية ظاهرة
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
    const accountId = this.cookieService.get('account_id');
    if (!accountId) return console.error('Account ID is missing in cookies.');

    this.CampaignsService.GetrecentActivity(Number(accountId)).subscribe({
      next: (data) => (this.recentActivity = data.records || []),
      error: (err) => console.error('Error fetching recent activity:', err),
    });
  }

  getActiveCampaigns() {
    const accountId = Number(this.cookieService.get('account_id'));
    if (!accountId) return console.error('Account ID not found in cookies.');

    this.CampaignsService.getActiveCampaigns(accountId).subscribe({
      next: (data) =>
        (this.ActiveCampaigns = data.campaigns?.slice(0, 3) || []),
      error: (error) =>
        console.error('Error fetching active campaigns:', error),
    });
  }

  // getSearchCampaigns() {
  //   const accountId = Number(this.cookieService.get('account_id'));
  //   if (!accountId) return console.error('Account ID is missing or invalid.');

  //   this.CampaignsService.getSearchCam(accountId).subscribe({
  //     next: (response) => {
  //       this.campaigns = response.campaigns || [];
  //       this.months = response.months || {};
  //       if (this.campaigns.length) {
  //         this.selectedCampaign = this.campaigns[0];
  //         this.campaignID = this.selectedCampaign.id;
  //       }
  //     },
  //   });
  // }
  getSearchCampaigns() {
    const accountId = Number(this.cookieService.get('account_id'));
    if (!accountId) return console.error('Account ID is missing or invalid.');

    this.CampaignsService.getSearchCam(accountId).subscribe({
      next: (response) => {
        this.campaigns = response.campaigns || [];
        this.months = response.months || {};

        if (this.campaigns.length) {
          this.selectedCampaign = this.campaigns[0];
          this.campaignID = this.selectedCampaign.id;

          this.onCampaignSelect(this.selectedCampaign);
        }
      },
      error: (err) => console.error('Error fetching campaigns:', err),
    });
  }

  onCampaignSelect(selectedCampaign: any) {
    const accountId = Number(this.cookieService.get('account_id'));
    if (!accountId) {
      console.error('Account ID is missing or invalid');
      return;
    }
    if (!selectedCampaign || !selectedCampaign.id) {
      console.error('Invalid campaign selected:', selectedCampaign);
      return;
    }

    const campaignId = selectedCampaign.id;
    console.log('Selected Campaign ID:', campaignId);

    this.CampaignsService.getCampaignById(accountId, campaignId).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        this.likesCount = response.likesCount;
        this.commentsCount = response.commentsCount;

        if (response?.months) {
          console.log('Months from API:', response.months);

          // تحديث البيانات
          this.months = response.months;
          this.labels = Object.keys(response.months); // استخراج الأشهر

          // إعادة تهيئة الرسم البياني بعد استلام البيانات
          this.initChart();
        } else {
          console.warn('Months data is missing in the response.');
          this.months = {};
          this.labels = [];
        }
      },
      error: (err) => console.error('Error fetching campaign data:', err),
    });
  }
}
