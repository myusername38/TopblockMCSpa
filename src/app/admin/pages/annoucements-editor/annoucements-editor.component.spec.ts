import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoucementsEditorComponent } from './annoucements-editor.component';

describe('AnnoucementsEditorComponent', () => {
  let component: AnnoucementsEditorComponent;
  let fixture: ComponentFixture<AnnoucementsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnoucementsEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnoucementsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
