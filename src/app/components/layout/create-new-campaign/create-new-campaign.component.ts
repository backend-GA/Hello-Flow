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
  value1 = 'United States';
  options: any;

  constructor(private fb: FormBuilder) {
    this.hashtagForm = this.fb.group({
      hashtag: ['', [Validators.required, Validators.maxLength(500)]],
      action: ['autoReply', Validators.required],
      comment: ['', [Validators.required, Validators.maxLength(500)]],
      duration: ['stopDate', Validators.required],
      stopDate: [''],
      selectedCountry: ['United States'],
      state: ['New York'],
      city: ['New York'],
    });
  }

  onSubmit() {
    if (this.hashtagForm.valid) {
      console.log('Form Data:', this.hashtagForm.value);
    }
  }

  saveDraft() {
    console.log('Draft Saved:', this.hashtagForm.value);
  }
}
