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
  selector: 'app-past-campaigns',
  standalone: true,
  imports: [CommonModule, Menu, Dialog, FormsModule, ReactiveFormsModule],
  templateUrl: './past-campaigns.component.html',
  styleUrl: './past-campaigns.component.scss',
})
export class PastCampaignsComponent {
  private account_id?: number; // accountId type as number
  PastCampaigns: any;
  ActiveCampaigns: any[] = [];
  campaignForm: FormGroup;
  items: MenuItem[] = [];
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
    this.GetPAST();

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
  GetPAST() {
    // Retrieve accountId from cookies
    const accountIdFromCookie = this.cookieService.get('account_id'); // Assuming the cookie name is 'accountId'

    // Convert to a number and assign it to the accountId property
    this.account_id = Number(accountIdFromCookie);

    if (this.account_id) {
      this.campaignService.getPastCampaign(this.account_id).subscribe(
        (data) => {
          this.PastCampaigns = data.campaigns;
          console.log(this.PastCampaigns); // Handle campaign data
        },
        (error) => {
          console.error('Error fetching campaigns:', error); // Handle error
        }
      );
    } else {
      console.error('Account ID not found in cookies.');
    }
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
          this.GetPAST();
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
    // ابحث عن الحملة في ActiveCampaigns أو PastCampaigns
    const campaign =
      this.ActiveCampaigns.find(
        (c) => c.id.toString() === campaignId.toString()
      ) ||
      this.PastCampaigns.find(
        (c: { id: { toString: () => string } }) =>
          c.id.toString() === campaignId.toString()
      );

    if (campaign) {
      console.log('Selected Campaign:', campaign); // تحقق من الحملة المحددة

      // تحويل التاريخ إلى تنسيق مناسب (مثلاً: Date أو ISO String)
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
      const accountId = this.account_id?.toString() || '';
      const campaignId = this.selectedCampaignId?.toString() || '';

      this.campaignService
        .updateCampaign(accountId, campaignId, payload)
        .subscribe(
          (response) => {
            console.log('Campaign updated successfully:', response);
            this.displayEditDialog = false;
            this.GetPAST();
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
