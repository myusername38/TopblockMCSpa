import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumablesReedemedChartComponent } from './consumables-reedemed-chart.component';

describe('ConsumablesReedemedChartComponent', () => {
  let component: ConsumablesReedemedChartComponent;
  let fixture: ComponentFixture<ConsumablesReedemedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumablesReedemedChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumablesReedemedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
