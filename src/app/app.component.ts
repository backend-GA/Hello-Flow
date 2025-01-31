import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SidebarModule } from 'primeng/sidebar';
import { CampaignsService } from './services/campaigns.service';
import { ShareDataService } from './services/share-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    SidebarComponent,
    SidebarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { ngSkipHydration: 'true' },
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'hello-flow';
  isOpen: boolean = true;
  loading: boolean = false; // Flag for loading state
  userName: any;
  userEmail: any;
  account_id: number | undefined;
  sidebarVisible: boolean = false;
  counts: any;
  credits: any;
  remainingCredits: any;
  usedCredits: any;
  sidebarshow: boolean = false;
  constructor(
    private Router: Router,
    public _ActivatedRoute: ActivatedRoute,
    private authService: AuthService,
    private _CookieService: CookieService,
    private campaignService: CampaignsService,
    private sharedDataService: ShareDataService
  ) {}

  closeUpgrade() {
    this.isOpen = false;
  }
  ngDoCheck(): void {
    if (
      this.Router.url == '/login' ||
      this.Router.url == '/register' ||
      this.Router.url == '/plans' ||
      this.Router.url == '/twitter-account'
    ) {
      this.sidebarshow = false;
    } else {
      this.sidebarshow = true;
    }
  }
  userData: any;

  ngOnInit(): void {
    this.loading = true; // Start loading
    this.authService.fetchUserData().subscribe({
      next: (response) => {
        this.loading = false; // Stop loading after data is fetched
        // Handle the response here, for example, assigning user data
        this.userData = response;
        const user = response;
        if (user) {
          const account_id = user.account_id;
          this.userName = user.username || '';
          this.userEmail = user.email || '';
          this.usedCredits = this.usedCredits;
          this.remainingCredits = this.remainingCredits;
          this.credits = this.credits;
          // Store in localStorage
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('userEmail', this.userEmail);
          localStorage.setItem('account_id', account_id); // Store accountId
          this._CookieService.set('credits', this.credits);
          this._CookieService.set('remainingCredits', this.remainingCredits);
          this._CookieService.set('usedCredits', this.usedCredits);
          this._CookieService.set('account_id', account_id); // Set accountId in cookies
        }
      },
      error: (error) => {
        this.loading = false; // Stop loading in case of error
        console.error('Error fetching user data:', error);
        this.Router.navigate(['/login']);
      },
    });
    const accountIdFromCookie = this._CookieService.get('account_id');
    if (accountIdFromCookie) {
      this.account_id = parseInt(accountIdFromCookie, 10);
    } else {
      console.error('Account ID not found in cookies.');
    }
    this.loadCampaignCounts();
  }
  private loadCampaignCounts(): void {
    const accountIdFromCookie = this._CookieService.get('account_id');

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
  logout(): void {
    localStorage.clear();

    this._CookieService.deleteAll();

    // Navigate to the login page
    this.Router.navigate(['/login']);
  }
}
