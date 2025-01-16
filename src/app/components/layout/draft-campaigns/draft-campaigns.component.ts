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
  private accountId: string = '11'; // Replace with dynamic value or get from cookies
  private campaignId: string = '12345';
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private campaignService: CampaignsService,
    private cookieService: CookieService //
  ) {}

  confirm2(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Are you sure you want to delete this campaign? This action cannot be undone.',
      header: 'Delete Campaign',
      icon: 'pi pi-trash',
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
        // Call deleteCampaign when the user confirms
        this.campaignService
          .deleteCampaign(this.accountId, this.campaignId)
          .subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Campaign deleted successfully',
              });
              // Optionally, handle additional logic like removing the deleted campaign from the UI
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete the campaign. Please try again.',
              });
            }
          );
      },

      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'You have cancelled the delete action.',
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

  deleteCampaign(): void {
    this.campaignService
      .deleteCampaign(this.accountId, this.campaignId)
      .subscribe(
        (response) => {
          console.log('Campaign deleted successfully:', response);
          // Handle successful deletion (e.g., update UI, notify user)
        },
        (error) => {
          console.error('Error deleting campaign:', error);
          // Handle error (e.g., show error message)
        }
      );
  }
}
