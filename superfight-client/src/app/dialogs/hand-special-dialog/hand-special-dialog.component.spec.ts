import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandSpecialDialogComponent } from './hand-special-dialog.component';

describe('HandSpecialDialogComponent', () => {
  let component: HandSpecialDialogComponent;
  let fixture: ComponentFixture<HandSpecialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandSpecialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandSpecialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
