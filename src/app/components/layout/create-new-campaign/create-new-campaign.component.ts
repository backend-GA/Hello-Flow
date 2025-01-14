import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-new-campaign',
  standalone: true,
  imports: [
    TabsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AutoComplete,
  ],
  templateUrl: './create-new-campaign.component.html',
  styleUrl: './create-new-campaign.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CreateNewCampaignComponent {
  hashtagForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignsService,
    private cookieService: CookieService
  ) {
    this.hashtagForm = this.fb.group({
      hashtag: ['', [Validators.required, Validators.maxLength(500)]],
      action: ['', Validators.required],
      comment: ['', [Validators.required, Validators.maxLength(500)]],
      duration: ['', Validators.required],
      end_date: ['', Validators.required],
      include_retweets: [false], // Boolean for include_retweets
    });
  }

  onSubmit(): void {
    if (this.hashtagForm.valid) {
      const hashtagInput = this.hashtagForm.value.hashtag;
      const hashtagsArray = hashtagInput
        .split(/\s*[,،]\s*|\s*و\s*/g) // Handle splitting by commas or "و"
        .map((tag: string) => tag.trim()) // Trim extra spaces
        .filter((tag: string) => tag); // Remove empty entries

      const payload = {
        search_terms: hashtagsArray,
        action: this.hashtagForm.value.action, // Action selected
        draft: false, // Assuming this is always false for now
        comments: [this.hashtagForm.value.comment], // Comments array
        include_retweets: this.hashtagForm.value.include_retweets, // Whether to include retweets
        end_date: this.hashtagForm.value.end_date, // End date for the campaign
      };

      console.log('Payload:', payload);

      // Get the account ID from cookies and convert it to a number
      const accountId = Number(this.cookieService.get('accountId')); // Convert to number

      if (accountId) {
        this.campaignService.createCampaign(accountId, payload).subscribe(
          (response) => {
            console.log('Campaign created successfully', response);
          },
          (error) => {
            console.error('Error creating campaign:', error);
          }
        );
      } else {
        console.error('Account ID is not available in cookies');
      }
    } else {
      console.error('Form is invalid');
    }
  }

  saveDraft() {
    if (this.hashtagForm.valid) {
      const hashtagInput = this.hashtagForm.value.hashtag;
      const hashtagsArray = hashtagInput
        .split(/\s*[,،]\s*|\s*و\s*/g) // Handle splitting by commas or "و"
        .map((tag: string) => tag.trim()) // Trim extra spaces
        .filter((tag: string) => tag); // Remove empty entries

      const payload = {
        search_terms: hashtagsArray,
        action: this.hashtagForm.value.action, // Action selected
        draft: true, // Assuming this is always false for now
        comments: [this.hashtagForm.value.comment], // Comments array
        include_retweets: this.hashtagForm.value.include_retweets, // Whether to include retweets
        end_date: this.hashtagForm.value.end_date, // End date for the campaign
      };

      console.log('Payload:', payload);

      // Get the account ID from cookies and convert it to a number
      const accountId = Number(this.cookieService.get('accountId')); // Convert to number

      if (accountId) {
        this.campaignService.createCampaign(accountId, payload).subscribe(
          (response) => {
            console.log('Campaign created successfully', response);
          },
          (error) => {
            console.error('Error creating campaign:', error);
          }
        );
      } else {
        console.error('Account ID is not available in cookies');
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
