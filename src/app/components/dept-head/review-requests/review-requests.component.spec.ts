import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRequestsComponent } from './review-requests.component';

describe('ReviewRequestsComponent', () => {
  let component: ReviewRequestsComponent;
  let fixture: ComponentFixture<ReviewRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
