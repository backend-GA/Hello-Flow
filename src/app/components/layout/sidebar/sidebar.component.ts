import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  closeUpgrade() {
    this.isOpen = false;
  }
  constructor(private authService: AuthService, private router: Router) {}
  logout(): void {
    this.authService.logout(); // Clear session
    this.router.navigate(['/login']); // Redirect to login
    localStorage.clear(); // Clear storage on logout
  }
  ngOnInit(): void {
    this.userName = localStorage.getItem('userName'); // Retrieve name
    this.userEmail = localStorage.getItem('userEmail'); // Retrieve email
  }
}
