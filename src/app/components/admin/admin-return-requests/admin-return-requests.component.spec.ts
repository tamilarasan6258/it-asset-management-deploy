import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReturnRequestsComponent } from './admin-return-requests.component';

describe('AdminReturnRequestsComponent', () => {
  let component: AdminReturnRequestsComponent;
  let fixture: ComponentFixture<AdminReturnRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReturnRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReturnRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
