import { Component, ViewEncapsulation } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-draft-campaigns',
  standalone: true,
  imports: [ConfirmDialogModule, ButtonModule, ToastModule],
  templateUrl: './draft-campaigns.component.html',
  styleUrl: './draft-campaigns.component.scss',
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class DraftCampaignsComponent {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private campaignService: CampaignsService,
    private cookieService: CookieService //
  ) {}

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Are you sure you want to delete this campaign? This action cannot be undone.',
      header: 'Delete Campaign',
      icon: 'pi pi-trash ',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'Campaign deleted',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  ngOnInit(): void {
    // Retrieve accountId from cookies
    const accountIdFromCookie = this.cookieService.get('accountId'); // Assuming the cookie name is 'accountId'

    // Check if accountId exists in cookies
    if (accountIdFromCookie) {
      const accountId = accountIdFromCookie; // Use accountId as string

      // Call the service with draft=true
      this.campaignService.getDraft(accountId, true).subscribe(
        (data) => {
          console.log('Campaigns with draft=true:', data); // Handle the response data
        },
        (error) => {
          console.error('Error fetching campaigns:', error); // Handle error
        }
      );
    } else {
      console.error('Account ID not found in cookies.');
    }
  }
}
