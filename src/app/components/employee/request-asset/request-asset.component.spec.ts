import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAssetComponent } from './request-asset.component';

describe('RequestAssetComponent', () => {
  let component: RequestAssetComponent;
  let fixture: ComponentFixture<RequestAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
