import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrreportsComponent } from './hrreports.component';

describe('HrreportsComponent', () => {
  let component: HrreportsComponent;
  let fixture: ComponentFixture<HrreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrreportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
