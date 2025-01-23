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
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-new-campaign',
  standalone: true,
  imports: [
    TabsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AutoComplete,
    RouterLink,
  ],
  templateUrl: './create-new-campaign.component.html',
  styleUrl: './create-new-campaign.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CreateNewCampaignComponent {
  hashtagForm: FormGroup;
  account_id: number | null = null;
  searchTermsList: any[] = [];
  showCommentInput = false;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignsService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.hashtagForm = this.fb.group({
      hashtag: ['', [Validators.required, Validators.maxLength(500)]],
      // action: ['', Validators.required],
      // comment: ['', [Validators.required, Validators.maxLength(500)]],
      duration: ['untilCancelled', Validators.required],
      end_date: ['', Validators.required],
      include_retweets: [false], // Boolean for include_retweets,
      action: ['autoLike'], // Default action
      comment: ['', [Validators.maxLength(500)]],
    });
  }
  ngOnInit(): void {
    this.account_id = Number(this.cookieService.get('account_id')); // Convert to number
    if (!this.account_id) {
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

      const hashtagsArray = this.hashtagForm.value.hashtag.split(/\s+/);

      const payload = {
        search_terms: hashtagsArray,
        action: action,
        draft: false,
        comments: [this.hashtagForm.value.comment],
        include_retweets: this.hashtagForm.value.include_retweets,
        end_date: this.hashtagForm.value.end_date,
      };

      if (this.account_id) {
        this.campaignService.createCampaign(this.account_id, payload).subscribe(
          (response) => {
            console.log('Campaign created successfully', response);
            this.router.navigate(['/Active_Campaigns']);

            this.hashtagForm.reset();
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
  onDurationChange(): void {
    if (this.hashtagForm.value.duration === 'untilCancelled') {
      this.hashtagForm.get('end_date')?.setValue(null); // Clear stop date
      this.hashtagForm.get('end_date')?.disable(); // Disable end_date
    } else {
      this.hashtagForm.get('end_date')?.enable(); // Enable end_date
    }
  }
  onActionChange(): void {
    const selectedAction = this.hashtagForm.value.action;

    if (selectedAction === 'autoReply' || selectedAction === 'autoLikeReply') {
      // Show comment input and set it as required
      this.showCommentInput = true;
      this.hashtagForm
        .get('comment')
        ?.setValidators([Validators.required, Validators.maxLength(500)]);
    } else {
      // Hide comment input and clear its value and validators
      this.showCommentInput = false;
      this.hashtagForm.get('comment')?.setValue('');
      this.hashtagForm.get('comment')?.clearValidators();
    }

    this.hashtagForm.get('comment')?.updateValueAndValidity(); // Update validators
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

      const hashtagsArray = this.hashtagForm.value.hashtag.split(/\s+/);

      const payload = {
        search_terms: hashtagsArray,
        action: action,
        is_draft: true,
        is_active: true,
        comments: [this.hashtagForm.value.comment],
        include_retweets: this.hashtagForm.value.include_retweets,
        end_date: this.hashtagForm.value.end_date,
      };

      if (this.account_id) {
        this.campaignService.createCampaign(this.account_id, payload).subscribe(
          (response) => {
            console.log('Campaign created successfully', response);
            this.router.navigate(['/Draft_Campaigns']);

            this.hashtagForm.reset();
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
  addSearchTerm(): void {
    const inputValue = this.hashtagForm.get('hashtag')?.value.trim();
    if (inputValue) {
      const uniqueTerms = Array.from(new Set(inputValue.split(/\s+/)));
      this.searchTermsList = uniqueTerms;
    }
  }
}
