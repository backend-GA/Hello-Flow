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
  sidebarshow: boolean = false;
  constructor(private Router: Router, public _ActivatedRoute: ActivatedRoute) {}

  closeUpgrade() {
    this.isOpen = false;
  }
  ngDoCheck(): void {
    if (
      this.Router.url == '/login' ||
      this.Router.url == '/register' ||
      this.Router.url == '/plans'
    ) {
      this.sidebarshow = false;
    } else {
      this.sidebarshow = true;
    }
  }
}
