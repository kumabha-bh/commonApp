import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionVolumeTrendComponent } from './production-volume-trend.component';

describe('ProductionVolumeTrendComponent', () => {
  let component: ProductionVolumeTrendComponent;
  let fixture: ComponentFixture<ProductionVolumeTrendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionVolumeTrendComponent]
    });
    fixture = TestBed.createComponent(ProductionVolumeTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
