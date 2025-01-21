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
  }
}
