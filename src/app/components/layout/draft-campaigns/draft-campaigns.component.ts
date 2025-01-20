import { Component, ViewEncapsulation } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-draft-campaigns',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    Dialog,
    ReactiveFormsModule,
    Menu,
  ],
  templateUrl: './draft-campaigns.component.html',
  styleUrl: './draft-campaigns.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class DraftCampaignsComponent {
  draftArray: any;

  campaignForm: FormGroup;
  ActiveCampaigns: any[] = [];
  items: MenuItem[] = [];
  accountId?: number;
  selectedCampaignId?: string | number;
  displayEditDialog = false; // Control dialog visibility
  campaignData: any = {}; // Campaign data for editing
  searchTermsList: any[] = [];
  confirmationService: any;

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

  draftCampaign() {
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

  constructor(
    private campaignService: CampaignsService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.campaignForm = this.fb.group({
      search_terms: ['', [Validators.required, Validators.maxLength(500)]], // Search terms array or string
      is_active: [false, Validators.required], // Boolean for active status
      is_draft: [true, Validators.required], // Boolean for draft status
      include_retweets: [true, Validators.required], // Boolean for retweets inclusion
      end_date: ['', Validators.required], // Date as a string or date object
    });
  }

  ngOnInit(): void {
    this.draftCampaign();
  }

  deleteCampaign(campaignId: string): void {
    if (!this.accountId) {
      console.error('Account ID is not set.');
      return;
    }
    this.campaignService
      .deleteCampaign(this.accountId.toString(), campaignId)
      .subscribe(
        (response) => {
          console.log('Campaign deleted successfully:', response);
          this.ActiveCampaigns = this.ActiveCampaigns.filter(
            (campaign) => campaign.id.toString() !== campaignId
          );
          this.draftCampaign();
        },
        (error) => {
          console.error('Error deleting campaign:', error);
        }
      );
  }

  selectCampaign(campaignId: string | number): void {
    this.selectedCampaignId = campaignId;
  }

  closeDialog(): void {
    this.displayEditDialog = false;
  }
  openDialog(): void {
    this.displayEditDialog = true;
  }
  editCampaign(campaignId: string | number): void {
    const campaign = this.draftArray.find(
      (c: { id: { toString: () => string } }) =>
        c.id.toString() === campaignId.toString()
    );

    if (campaign) {
      console.log('Selected Campaign:', campaign);

      const endDate = campaign.end_date
        ? new Date(campaign.end_date).toISOString().split('T')[0]
        : '';

      // Ensure search_terms is an array, split it by space or any other delimiter if needed
      const searchTerms = campaign.search_terms
        ? campaign.search_terms.join(' ')
        : ''; // Join array to string for the input field

      // Patch form values
      this.campaignForm.patchValue({
        search_terms: searchTerms, // If it's a string, we just patch it
        is_active: campaign.is_active || true,
        is_draft: campaign.is_draft || false,
        include_retweets: campaign.include_retweets || true,
        end_date: endDate,
      });

      // Set internal list for search terms
      this.searchTermsList = campaign.search_terms || []; // Use the array as internal list

      // Open the dialog after patching values
      setTimeout(() => {
        this.displayEditDialog = true;
      }, 0);
    } else {
      console.error('Campaign not found with ID:', campaignId);
    }
  }

  addSearchTerm(event: KeyboardEvent): void {
    const inputValue = this.campaignForm.get('search_terms')?.value.trim();
    if (inputValue) {
      // Split input text into unique terms
      const uniqueTerms = Array.from(new Set(inputValue.split(/\s+/))); // Unique terms (by space)
      this.searchTermsList = uniqueTerms; // Update internal list with unique terms

      // Update form value (as a string)
      this.campaignForm.patchValue({
        search_terms: uniqueTerms.join(' '), // Convert back to string with space separator
      });
    }
  }

  submitCampaignForm(): void {
    if (this.campaignForm.valid) {
      const payload = {
        ...this.campaignForm.value,
        search_terms: this.searchTermsList, // Ensure search_terms is passed as an array
      };
      const accountId = this.accountId?.toString() || '';
      const campaignId = this.selectedCampaignId?.toString() || '';

      this.campaignService
        .updateCampaign(accountId, campaignId, payload)
        .subscribe(
          (response) => {
            console.log('Campaign updated successfully:', response);
            this.displayEditDialog = false;
            this.draftCampaign(); // Reload campaigns after update
          },
          (error) => {
            console.error('Error updating campaign:', error);
          }
        );
    } else {
      console.warn('Campaign form is invalid.');
    }
  }
}
