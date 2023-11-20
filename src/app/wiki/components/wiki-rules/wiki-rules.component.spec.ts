import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiRulesComponent } from './wiki-rules.component';

describe('WikiRulesComponent', () => {
  let component: WikiRulesComponent;
  let fixture: ComponentFixture<WikiRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WikiRulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WikiRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
