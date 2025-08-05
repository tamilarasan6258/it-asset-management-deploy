import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptReturnReviewComponent } from './dept-return-review.component';

describe('DeptReturnReviewComponent', () => {
  let component: DeptReturnReviewComponent;
  let fixture: ComponentFixture<DeptReturnReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptReturnReviewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeptReturnReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
