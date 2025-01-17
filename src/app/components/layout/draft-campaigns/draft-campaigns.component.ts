import { Component, ViewEncapsulation } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-draft-campaigns',
  standalone: true,
  imports: [ConfirmDialogModule, ButtonModule, ToastModule, CommonModule],
  templateUrl: './draft-campaigns.component.html',
  styleUrl: './draft-campaigns.component.scss',
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class DraftCampaignsComponent {
  draftArray: any;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private campaignService: CampaignsService,
    private cookieService: CookieService //
  ) {}
  confirm2(event: Event, campaignId: string): void {
    const accountId = this.cookieService.get('accountId'); // Retrieve accountId from cookies

    if (!accountId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Account ID not found. Please try again.',
      });
      return; // Exit if accountId is not available
    }

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
        this.campaignService
          .deleteCampaign(String(accountId), campaignId) // Convert accountId to number
          .subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Campaign deleted successfully',
              });
              this.draftArray = this.draftArray.filter(
                (campaign: { id: string }) => campaign.id !== campaignId
              );
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
          this.draftArray = data.campaigns;

          console.log('res', this.draftArray); // Handle the response data
        },
        (error) => {
          console.error('Error fetching campaigns:', error); // Handle error
        }
      );
    } else {
      console.error('Account ID not found in cookies.');
    }
  }

  // deleteCampaign(): void {
  //   this.campaignService
  //     .deleteCampaign(this.accountId, this.campaignId)
  //     .subscribe(
  //       (response) => {
  //         console.log('Campaign deleted successfully:', response);
  //         // Handle successful deletion (e.g., update UI, notify user)
  //       },
  //       (error) => {
  //         console.error('Error deleting campaign:', error);
  //         // Handle error (e.g., show error message)
  //       }
  //     );
  // }
}
