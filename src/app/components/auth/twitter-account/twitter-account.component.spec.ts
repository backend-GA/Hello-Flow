import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterAccountComponent } from './twitter-account.component';

describe('TwitterAccountComponent', () => {
  let component: TwitterAccountComponent;
  let fixture: ComponentFixture<TwitterAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwitterAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwitterAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
