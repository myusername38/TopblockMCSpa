import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiFeaturesComponent } from './wiki-features.component';

describe('WikiFeaturesComponent', () => {
  let component: WikiFeaturesComponent;
  let fixture: ComponentFixture<WikiFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WikiFeaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WikiFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
