import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSpecialDialogComponent } from './custom-special-dialog.component';

describe('CustomSpecialDialogComponent', () => {
  let component: CustomSpecialDialogComponent;
  let fixture: ComponentFixture<CustomSpecialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSpecialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSpecialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
