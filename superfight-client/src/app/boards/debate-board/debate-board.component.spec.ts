import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebateBoardComponent } from './debate-board.component';

describe('DebateBoardComponent', () => {
  let component: DebateBoardComponent;
  let fixture: ComponentFixture<DebateBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebateBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebateBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
