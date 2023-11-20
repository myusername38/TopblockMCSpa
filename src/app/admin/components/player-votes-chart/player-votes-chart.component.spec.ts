import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerVotesChartComponent } from './player-votes-chart.component';

describe('PlayerVotesChartComponent', () => {
  let component: PlayerVotesChartComponent;
  let fixture: ComponentFixture<PlayerVotesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerVotesChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerVotesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
