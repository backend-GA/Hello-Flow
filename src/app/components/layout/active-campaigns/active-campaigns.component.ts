import { Component } from '@angular/core';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-active-campaigns',
  standalone: true,
  imports: [CommonModule, Menu, Dialog, FormsModule, ReactiveFormsModule],
  templateUrl: './active-campaigns.component.html',
  styleUrls: ['./active-campaigns.component.scss'],
})
export class ActiveCampaignsComponent {
  campaignForm: FormGroup;
  ActiveCampaigns: any[] = [];
  items: MenuItem[] = [];
  accountId?: number;
  selectedCampaignId?: string | number;
  displayEditDialog = false; // Control dialog visibility
  campaignData: any = {}; // Campaign data for editing
  searchTermsList: any[] = []; // List to store added search terms

  constructor(
    private campaignService: CampaignsService,
    private cookieService: CookieService,
    private fb: FormBuilder
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
    this.getActiveCampaigns();
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
  }
  getActiveCampaigns() {
    const accountIdFromCookie = this.cookieService.get('accountId');
    if (accountIdFromCookie) {
      this.accountId = Number(accountIdFromCookie);
      this.campaignService.getActiveCampaigns(this.accountId).subscribe(
        (data) => {
          this.ActiveCampaigns = data.campaigns || [];
        },
        (error) => {
          console.error('Error fetching active campaigns:', error);
        }
      );
    } else {
      console.error('Account ID not found in cookies.');
    }
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
        },
        (error) => {
          console.error('Error deleting campaign:', error);
        }
      );
  }

  selectCampaign(campaignId: string | number): void {
    this.selectedCampaignId = campaignId;
  }

  editCampaign(campaignId: string | number): void {
    const campaign = this.ActiveCampaigns.find((c) => c.id === campaignId);
    if (campaign) {
      this.campaignForm.patchValue({
        search_terms: campaign.search_terms.join(' ') || '',
        is_active: campaign.is_active || false,
        is_draft: campaign.is_draft || true,
        include_retweets: campaign.include_retweets || true,
        end_date: campaign.end_date || '',
      });
      this.displayEditDialog = true; // Open the dialog when editing
    }
  }

  // Add search terms from input to the searchTermsList
  // addSearchTerm(): void {
  //   const inputValue = this.campaignForm.get('search_terms')?.value.trim();
  //   if (inputValue) {
  //     // Split the input value into terms based on spaces
  //     const terms = inputValue.split(/\s+/);
  //     this.searchTermsList.push(...terms); // Add terms to the list
  //     this.campaignForm.get('search_terms')?.setValue(''); // Clear the input field after adding
  //   }
  // }
  addSearchTerm(): void {
    const inputValue = this.campaignForm.get('search_terms')?.value.trim();
    if (inputValue) {
      const uniqueTerms = Array.from(new Set(inputValue.split(/\s+/)));
      this.searchTermsList = uniqueTerms; // تحديث قائمة المصطلحات
    }
  }

  // Submit the form to update campaign
  submitCampaignForm(): void {
    if (this.campaignForm.valid) {
      const payload = {
        ...this.campaignForm.value,
        search_terms: this.searchTermsList,
      };
      const accountId = this.accountId?.toString() || '';
      const campaignId = this.selectedCampaignId?.toString() || '';

      this.campaignService
        .updateCampaign(accountId, campaignId, payload)
        .subscribe(
          (response) => {
            console.log('Campaign updated successfully:', response);
            this.displayEditDialog = false;
            this.getActiveCampaigns();
          },
          (error) => {
            console.error('Error updating campaign:', error);
          }
        );
    } else {
      console.warn('Campaign form is invalid.');
    }
  }

  // Close the edit dialog
  closeDialog(): void {
    this.displayEditDialog = false;
  }
}
