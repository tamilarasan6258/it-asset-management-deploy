import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptheadDashboardComponent } from './depthead-dashboard.component';

describe('DeptheadDashboardComponent', () => {
  let component: DeptheadDashboardComponent;
  let fixture: ComponentFixture<DeptheadDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptheadDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptheadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
