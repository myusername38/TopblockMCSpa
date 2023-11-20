import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiVotingComponent } from './wiki-voting.component';

describe('WikiVotingComponent', () => {
  let component: WikiVotingComponent;
  let fixture: ComponentFixture<WikiVotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WikiVotingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WikiVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
