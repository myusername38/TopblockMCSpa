import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDualSelectorComponent } from './form-dual-selector.component';

describe('FormDualSelectorComponent', () => {
  let component: FormDualSelectorComponent;
  let fixture: ComponentFixture<FormDualSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDualSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDualSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
