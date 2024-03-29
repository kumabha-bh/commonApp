import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendWidgetComponent } from './trend-widget.component';

describe('TrendWidgetComponent', () => {
  let component: TrendWidgetComponent;
  let fixture: ComponentFixture<TrendWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrendWidgetComponent]
    });
    fixture = TestBed.createComponent(TrendWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
