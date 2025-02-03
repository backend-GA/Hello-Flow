import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllActivityComponent } from './all-activity.component';

describe('AllActivityComponent', () => {
  let component: AllActivityComponent;
  let fixture: ComponentFixture<AllActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
