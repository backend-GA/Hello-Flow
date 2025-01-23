import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { CampaignsService } from '../../../services/campaigns.service';
import { ShareDataService } from '../../../services/share-data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host: { ngSkipHydration: 'true' },
})
export class SidebarComponent {
  isOpen: boolean = true;
  userName: string | null = '';
  userEmail: string | null = '';
  counts: any;
  usage: string | null = '';
  sidebarVisible: boolean = false; // To control Sidebar visibility
  account_id: string | null = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private campaignService: CampaignsService,
    private sharedDataService: ShareDataService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.clear();
  }

  ngOnInit(): void {
    const accountIdFromCookie = this.cookieService.get('account_id');

    if (accountIdFromCookie) {
      this.loadCampaignCounts();
    } else {
      this.authService.fetchUserData().subscribe({
        next: (response) => {
          this.usage = response.user.usage;

          const accountId = response?.user?.account_id;
          if (accountId) {
            this.cookieService.set('accountId', accountId.toString());
            this.cookieService.set('usage', response.user.usage);

            this.loadCampaignCounts(); // لا تمرر معلمة إذا كانت لا تحتاج إليها
          } else {
            console.error('Account ID not found in user data.');
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
          this.router.navigate(['/login']);
        },
      });
    }
    this.userName = localStorage.getItem('userName'); // Retrieve name
    this.userEmail = localStorage.getItem('userEmail'); // Retrieve name
    this.usage = this.cookieService.get('usage'); // قراءة أي قيمة أخرى مثل completed
    console.log(this.usage);
    this.sharedDataService.counts$.subscribe((newCounts) => {
      if (newCounts) {
        this.counts = newCounts;
      }
    });
    this.getAllCookies();
    this.account_id = this.cookieService.get('account_id'); // Retrieve account_id from cookies
    this.updateAccountId();
    this.loadCampaignCounts();
  }
  updateAccountId() {
    this.authService.fetchUserData().subscribe(
      (response) => {
        const account_id = response.account_id; // Ensure this matches your API response
        if (account_id) {
          this.cookieService.set('account_id', account_id, {
            path: '/',
            secure: true,
            sameSite: 'Lax',
          });
          console.log('Account ID updated in cookies:', account_id);
        }
      },
      (error) => {
        console.error('Failed to fetch user data:', error);
      }
    );
  }
  private loadCampaignCounts(): void {
    const accountIdFromCookie = this.cookieService.get('account_id');

    this.campaignService.getCampaignCounts(accountIdFromCookie).subscribe({
      next: (data) => {
        console.log('Full campaign data response:', data);
        this.counts = data?.counts;
        this.sharedDataService.updateCounts(this.counts);
      },
      error: (error) => {
        console.error('Error fetching campaign counts:', error);
      },
    });
  }

  closeUpgrade() {
    this.isOpen = false;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; // Toggle the visibility of Sidebar
  }

  updateTokenInCookies(token: string) {
    this.cookieService.set('authToken', token, 1, '/'); // Set token with 7-day expiry
  }
  getAllCookies() {
    const allCookies = this.cookieService.getAll();
    console.log('All Cookies:', allCookies); // Display all cookies
  }
}
