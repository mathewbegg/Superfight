import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectingBoardComponent } from './selecting-board.component';

describe('SelectingBoardComponent', () => {
  let component: SelectingBoardComponent;
  let fixture: ComponentFixture<SelectingBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectingBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
