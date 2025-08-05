import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptAssignedAssetsComponent } from './dept-assigned-assets.component';

describe('DeptAssignedAssetsComponent', () => {
  let component: DeptAssignedAssetsComponent;
  let fixture: ComponentFixture<DeptAssignedAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptAssignedAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptAssignedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
