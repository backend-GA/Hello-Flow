import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CampaignsService } from '../../../services/campaigns.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterLink } from '@angular/router';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-create-new-campaign',
  standalone: true,
  imports: [
    TabsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    RouterLink,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    MatChipsModule,
  ],
  templateUrl: './create-new-campaign.component.html',
  styleUrl: './create-new-campaign.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [LiveAnnouncer], // ✅ تأكد من إضافته هنا
})
export class CreateNewCampaignComponent {
  hashtagForm: FormGroup;
  account_id: number | null = null;
  searchTermsList: any[] = [];
  showCommentInput = false;
  selectedTab = '0'; // Default to the first tab
  hashtagInput = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA]; // السماح بإضافة العنصر عند الضغط على Enter أو الفاصلة
  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignsService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.hashtagForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      hashtagControl: [[], Validators.required], // يجب أن يكون مصفوفة
      duration: ['untilCancelled', Validators.required],
      end_date: [{ value: null, disabled: true }], // Initially disabled
      include_retweets: [false],
      action: [''],
      comment: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.account_id = Number(this.cookieService.get('account_id')) || null;
    if (!this.account_id) {
      console.error('Account ID is not available or invalid');
    }
  }

  onDropdownChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedTab = target.value;
  }

  // onSubmit(): void {
  //   console.log('Submit button clicked!');

  //   const actionMap: { [key: string]: string } = {
  //     autoLike: 'like',
  //     autoReply: 'comment',
  //     autoLikeReply: 'like&comment',
  //   };

  //   const action = actionMap[this.hashtagForm.value.action];

  //   if (!action) {
  //     console.error('Invalid action selected');
  //     return;
  //   }

  //   const hashtagsArray = this.hashtagForm.value.hashtag.split(/\s+/);

  //   const payload: any = {
  //     name: this.hashtagForm.value.name,
  //     search_terms: this.hashtagForm.value.hashtagControl || [], // تأكد من أنها دائمًا مصفوفة
  //     action: action,
  //     draft: false,
  //     comments: [this.hashtagForm.value.comment],
  //     include_retweets: this.hashtagForm.value.include_retweets,
  //   };

  //   // Only include end_date if it's not null or empty
  //   const endDate = this.hashtagForm.get('end_date')?.value;
  //   if (endDate) {
  //     payload.end_date = endDate;
  //   }

  //   if (this.account_id) {
  //     this.campaignService.createCampaign(this.account_id, payload).subscribe(
  //       (response) => {
  //         console.log('Campaign created successfully', response);
  //         this.router.navigate(['/Active_Campaigns']);
  //         this.hashtagForm.reset();
  //       },
  //       (error) => console.error('Error creating campaign:', error)
  //     );
  //   } else {
  //     console.error('Account ID is not available');
  //   }

  //   alert(`Submitted Hashtags: ${this.hashtagControl.value?.join(', ')}`);
  // }
  onSubmit(): void {
    console.log('Submit button clicked!');

    if (this.hashtagForm.invalid) {
      console.error('Form is invalid');
      return;
    }

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

    // التأكد من أن `search_terms` تحتوي على مصفوفة صحيحة
    const hashtagsArray: string[] = this.hashtagForm.value.hashtagControl || [];

    const payload: any = {
      name: this.hashtagForm.value.name,
      search_terms: hashtagsArray,
      action: action,
      draft: false,
      comments: [this.hashtagForm.value.comment],
      include_retweets: this.hashtagForm.value.include_retweets,
    };

    // إضافة `end_date` فقط إذا كانت موجودة
    const endDate = this.hashtagForm.get('end_date')?.value;
    if (endDate) {
      payload.end_date = endDate;
    }

    if (this.account_id) {
      this.campaignService.createCampaign(this.account_id, payload).subscribe(
        (response) => {
          console.log('Campaign created successfully', response);
          this.router.navigate(['/Active_Campaigns']);
          this.hashtagForm.reset();
        },
        (error) => console.error('Error creating campaign:', error)
      );
    } else {
      console.error('Account ID is not available');
    }

    // تأكد من أن `this.hashtagControl.value` مصفوفة لتجنب الأخطاء
    if (Array.isArray(this.hashtagControl.value)) {
      alert(`Submitted Hashtags: ${this.hashtagControl.value.join(', ')}`);
    } else {
      console.error('Invalid hashtag format');
    }
  }

  onDurationChange(): void {
    const duration = this.hashtagForm.get('duration')?.value;
    if (duration === 'untilCancelled') {
      this.hashtagForm.get('end_date')?.setValue(undefined);
      this.hashtagForm.get('end_date')?.disable();
    } else {
      this.hashtagForm.get('end_date')?.enable();
    }
  }

  onActionChange(): void {
    const selectedAction = this.hashtagForm.value.action;
    if (selectedAction === 'autoReply' || selectedAction === 'autoLikeReply') {
      this.showCommentInput = true;
      this.hashtagForm
        .get('comment')
        ?.setValidators([Validators.required, Validators.maxLength(500)]);
    } else {
      this.showCommentInput = false;
      this.hashtagForm.get('comment')?.setValue(null);
      this.hashtagForm.get('comment')?.clearValidators();
    }
    this.hashtagForm.get('comment')?.updateValueAndValidity();
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

      const hashtagsArray: string[] =
        this.hashtagForm.value.hashtagControl || [];

      const endDate =
        this.hashtagForm.get('duration')?.value === 'end_date'
          ? this.hashtagForm.get('end_date')?.value
          : undefined;

      const payload = {
        name: this.hashtagForm.value.name,
        search_terms: hashtagsArray,
        action: action,
        is_draft: true,
        is_active: true,
        comments: [this.hashtagForm.value.comment],
        include_retweets: this.hashtagForm.value.include_retweets,
        end_date: endDate, // Send undefined if "Run until cancelled"
      };

      if (this.account_id) {
        this.campaignService.createCampaign(this.account_id, payload).subscribe(
          (response) => {
            console.log('Campaign saved as draft successfully', response);
            this.router.navigate(['/Draft_Campaigns']);
            this.hashtagForm.reset();
          },
          (error) => console.error('Error saving draft:', error)
        );
      } else {
        console.error('Account ID is not available');
      }
    } else {
      console.error('Form is invalid');
    }
  }

  // addSearchTerm(): void {
  //   const inputValue = this.hashtagForm.get('hashtag')?.value.trim();
  //   if (inputValue) {
  //     const uniqueTerms = Array.from(new Set(inputValue.split(/\s+/)));
  //     this.searchTermsList = uniqueTerms;
  //   }
  // }
  addSearchTerm(event: any): void {
    event.preventDefault(); // Prevent form submission if inside a form
    const inputValue = this.hashtagForm.get('hashtag')?.value.trim();

    if (inputValue) {
      const uniqueTerms = new Set([
        ...this.searchTermsList,
        ...inputValue.split(/\s+/),
      ]);
      this.searchTermsList = Array.from(uniqueTerms);
      this.hashtagForm.get('hashtag')?.setValue(''); // Clear input field
    }
  }
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // منع الانتقال لسطر جديد فقط

      const inputValue = (event.target as HTMLInputElement).value.trim();
      if (inputValue) {
        this.searchTermsList.push(inputValue);

        // إعادة تعيين الحقل بعد الإضافة
        (event.target as HTMLInputElement).value = '';
      }
    }
  }

  removeSearchTerm(index: number): void {
    this.searchTermsList.splice(index, 1);
  }

  sendSearchTerms(): void {
    console.log('تم إرسال الهاشتاجات:', this.searchTermsList);
    // هنا يمكنك استبدال console.log بإرسال البيانات للسيرفر
  }
  get hashtagControl() {
    return this.hashtagForm.get('hashtagControl') as FormControl;
  }

  addHashtag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    if (value) {
      const hashtags = this.hashtagControl.value;
      hashtags.push(value);
      this.hashtagControl.setValue(hashtags);
    }

    if (input) {
      input.value = '';
    }
  }

  removeHashtag(hashtag: string): void {
    const hashtags = this.hashtagControl.value.filter(
      (h: string) => h !== hashtag
    );
    this.hashtagControl.setValue(hashtags);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
