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
  account_id?: number;
  selectedCampaignId?: string | number;
  displayEditDialog = false; // Control dialog visibility
  campaignData: any = {}; // Campaign data for editing
  searchTermsList: any[] = [];
  confirmationService: any;

  confirm2(event: Event, campaignId: string): void {
    const account_id = this.cookieService.get('account_id'); // Retrieve accountId from cookies

    if (!account_id) {
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
          .deleteCampaign(String(account_id), campaignId) // Convert accountId to number
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
    const accountIdFromCookie = this.cookieService.get('account_id'); // Assuming the cookie name is 'accountId'

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
    const accountIdFromCookie = this.cookieService.get('account_id');
    if (accountIdFromCookie) {
      this.account_id = parseInt(accountIdFromCookie, 10);
    } else {
      console.error('Account ID not found in cookies.');
    }

    this.items = [
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () =>
          this.deleteCampaign(this.selectedCampaignId?.toString() ?? ''),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.editCampaign(this.selectedCampaignId?.toString() ?? '');
          this.displayEditDialog = true; // Open the dialog after editing
        },
      },
    ];
    this.draftCampaign();
  }

  deleteCampaign(campaignId: string): void {
    if (!this.account_id) {
      console.error('Account ID is not set.');
      return;
    }
    this.campaignService
      .deleteCampaign(this.account_id.toString(), campaignId)
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
  editCampaign(campaignId: string | number): void {
    const campaign =
      this.ActiveCampaigns.find(
        (c) => c.id.toString() === campaignId.toString()
      ) ||
      this.draftArray.find(
        (c: { id: { toString: () => string } }) =>
          c.id.toString() === campaignId.toString()
      );

    if (campaign) {
      console.log('Selected Campaign:', campaign); // تحقق من الحملة المحددة

      const endDate = campaign.end_date
        ? new Date(campaign.end_date).toISOString().split('T')[0]
        : '';

      // تعيين القيم في النموذج
      this.campaignForm.patchValue({
        search_terms: campaign.search_terms
          ? campaign.search_terms.join(' ')
          : '',
        is_active: campaign.is_active,
        is_draft: campaign.is_draft,
        include_retweets: campaign.include_retweets,
        end_date: endDate, // تعيين التاريخ
      });

      console.log('Form Values:', this.campaignForm.value); // تحقق من القيم في النموذج

      // تعيين searchTermsList بالقيم الموجودة في campaign
      this.searchTermsList = campaign.search_terms || [];

      // فتح الديلوج بعد تعيين القيم
      setTimeout(() => {
        this.displayEditDialog = true; // فتح الديلوج بعد تعيين القيم
      }, 0);
    } else {
      console.error('Campaign not found with ID:', campaignId); // تحقق إذا كانت الحملة غير موجودة
    }
  }

  addSearchTerm(event: KeyboardEvent): void {
    const inputValue = this.campaignForm.get('search_terms')?.value.trim();
    if (inputValue) {
      // تقسيم المدخلات باستخدام المسافات أو الفواصل
      const uniqueTerms = Array.from(new Set(inputValue.split(/\s+/)));
      this.searchTermsList = uniqueTerms; // تحديث قائمة المصطلحات
    }
  }
  submitCampaignForm(): void {
    if (this.campaignForm.valid) {
      const payload = {
        ...this.campaignForm.value,
        search_terms: this.searchTermsList,
      };
      const account_id = this.account_id?.toString() || '';
      const campaignId = this.selectedCampaignId?.toString() || '';

      this.campaignService
        .updateCampaign(account_id, campaignId, payload)
        .subscribe(
          (response) => {
            console.log('Campaign updated successfully:', response);
            this.displayEditDialog = false;
            this.draftCampaign();
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
