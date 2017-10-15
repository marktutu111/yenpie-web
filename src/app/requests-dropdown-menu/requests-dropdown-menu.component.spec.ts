import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsDropdownMenuComponent } from './requests-dropdown-menu.component';

describe('RequestsDropdownMenuComponent', () => {
  let component: RequestsDropdownMenuComponent;
  let fixture: ComponentFixture<RequestsDropdownMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsDropdownMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
