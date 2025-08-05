import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReviewRequestsComponent } from './admin-review-requests.component';

describe('AdminReviewRequestsComponent', () => {
  let component: AdminReviewRequestsComponent;
  let fixture: ComponentFixture<AdminReviewRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReviewRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReviewRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
