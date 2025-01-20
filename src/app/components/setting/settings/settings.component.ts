import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from 'express';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  userName: string | null = '';
  userEmail: string | null = '';
  dataarray: any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Retrieve name and email from localStorage
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmail');

    // Fetch user data using the authService
    this.authService.fetchUserData().subscribe({
      next: (data: any) => {
        this.dataarray = data;
        console.log(data); // Logging the fetched data
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      },
    });
  }
}
