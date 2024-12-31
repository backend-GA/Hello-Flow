import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastCampaignsComponent } from './past-campaigns.component';

describe('PastCampaignsComponent', () => {
  let component: PastCampaignsComponent;
  let fixture: ComponentFixture<PastCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastCampaignsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
