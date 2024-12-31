import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftCampaignsComponent } from './draft-campaigns.component';

describe('DraftCampaignsComponent', () => {
  let component: DraftCampaignsComponent;
  let fixture: ComponentFixture<DraftCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftCampaignsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
