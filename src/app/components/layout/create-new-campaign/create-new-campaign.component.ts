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
  accountId: number | null = null;

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
  ngOnInit(): void {
    this.accountId = Number(this.cookieService.get('accountId')); // Convert to number
    if (!this.accountId) {
      console.error('Account ID is not available or invalid');
    }
  }
  onSubmit(): void {
    if (this.hashtagForm.valid) {
      const actionMap: { [key: string]: string } = {
        autoLike: 'like',
        autoReply: 'comment',
        autoLikeReply: 'like&comment',
      };

      const action = actionMap[this.hashtagForm.value.action];

      if (!action) {
        console.error('Invalid action selected');
        return;
      }

      const hashtagsArray = this.hashtagForm.value.hashtag
        .split(/\s*[,،]\s*|\s*و\s*/g)
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);

      const payload = {
        search_terms: hashtagsArray,
        action: action,
        draft: false,
        comments: [this.hashtagForm.value.comment],
        include_retweets: this.hashtagForm.value.include_retweets,
        end_date: this.hashtagForm.value.end_date,
      };

      if (this.accountId) {
        this.campaignService.createCampaign(this.accountId, payload).subscribe(
          (response) => {
            console.log('Campaign created successfully', response);
          },
          (error) => {
            console.error('Error creating campaign:', error);
          }
        );
      } else {
        console.error('Account ID is not available');
      }
    } else {
      console.error('Form is invalid');
    }
  }

  saveDraft(): void {
    if (this.hashtagForm.valid) {
      const actionMap: { [key: string]: string } = {
        autoLike: 'like',
        autoReply: 'comment',
        autoLikeReply: 'like&comment',
      };

      const action = actionMap[this.hashtagForm.value.action];

      if (!action) {
        console.error('Invalid action selected');
        return;
      }

      const hashtagsArray = this.hashtagForm.value.hashtag
        .split(/\s*[,،]\s*|\s*و\s*/g)
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);

      const payload = {
        search_terms: hashtagsArray,
        action: action,
        is_active: false,
        is_draft: true,
        comments: [this.hashtagForm.value.comment],
        include_retweets: this.hashtagForm.value.include_retweets,
        end_date: this.hashtagForm.value.end_date,
      };

      if (this.accountId) {
        this.campaignService.createCampaign(this.accountId, payload).subscribe(
          (response) => {
            console.log('Campaign created successfully', response);
          },
          (error) => {
            console.error('Error creating campaign:', error);
          }
        );
      } else {
        console.error('Account ID is not available');
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
