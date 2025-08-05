import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAssetComponent } from './assign-asset.component';

describe('AssignAssetComponent', () => {
  let component: AssignAssetComponent;
  let fixture: ComponentFixture<AssignAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
