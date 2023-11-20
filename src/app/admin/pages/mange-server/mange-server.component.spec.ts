import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangeServerComponent } from './mange-server.component';

describe('MangeServerComponent', () => {
  let component: MangeServerComponent;
  let fixture: ComponentFixture<MangeServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangeServerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangeServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
