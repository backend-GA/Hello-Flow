import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { ngSkipHydration: 'true' },
  providers: [MessageService],
})
export class AppComponent {
  title = 'hello-flow';
  isOpen: boolean = true;
  loading: boolean = false; // Flag for loading state
  userName: any;
  userEmail: any;
  accountId: number | undefined; // تعريف الخاصية

  sidebarshow: boolean = false;
  constructor(
    private Router: Router,
    public _ActivatedRoute: ActivatedRoute,
    private authService: AuthService,
    private _CookieService: CookieService
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
        const user = response?.user;
        if (user) {
          const accountId = user.account_id;
          this.userName = user.username || '';
          this.userEmail = user.email || '';
          // Store in localStorage
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('userEmail', this.userEmail);
          localStorage.setItem('accountId', accountId?.toString()); // Store accountId
          this._CookieService.set('accountId', accountId?.toString()); // Set accountId in cookies
        }
      },
      error: (error) => {
        this.loading = false; // Stop loading in case of error
        console.error('Error fetching user data:', error);
        this.Router.navigate(['/login']);
      },
    });
    const accountIdFromCookie = this._CookieService.get('accountId');
    if (accountIdFromCookie) {
      this.accountId = parseInt(accountIdFromCookie, 10);
    } else {
      console.error('Account ID not found in cookies.');
    }
  }
}
