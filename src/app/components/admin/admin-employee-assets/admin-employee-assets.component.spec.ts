import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmployeeAssetsComponent } from './admin-employee-assets.component';

describe('AdminEmployeeAssetsComponent', () => {
  let component: AdminEmployeeAssetsComponent;
  let fixture: ComponentFixture<AdminEmployeeAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEmployeeAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEmployeeAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
