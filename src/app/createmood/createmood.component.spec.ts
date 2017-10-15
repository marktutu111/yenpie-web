import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemoodComponent } from './createmood.component';

describe('CreatemoodComponent', () => {
  let component: CreatemoodComponent;
  let fixture: ComponentFixture<CreatemoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatemoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatemoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
