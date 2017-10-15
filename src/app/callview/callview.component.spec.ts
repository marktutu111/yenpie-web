import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallviewComponent } from './callview.component';

describe('CallviewComponent', () => {
  let component: CallviewComponent;
  let fixture: ComponentFixture<CallviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
