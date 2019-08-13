/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ToysComponent } from './toys.component';

describe('ToysComponent', () => {
  let component: ToysComponent;
  let fixture: ComponentFixture<ToysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
