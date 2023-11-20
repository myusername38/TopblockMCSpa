import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CratesComponent } from './crates.component';

describe('CratesComponent', () => {
  let component: CratesComponent;
  let fixture: ComponentFixture<CratesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CratesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
