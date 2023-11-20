import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumablesGivenChartComponent } from './consumables-given-chart.component';

describe('ConsumablesGivenChartComponent', () => {
  let component: ConsumablesGivenChartComponent;
  let fixture: ComponentFixture<ConsumablesGivenChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumablesGivenChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumablesGivenChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
