import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllordersbymonthComponent } from './allordersbymonth.component';

describe('AllordersbymonthComponent', () => {
  let component: AllordersbymonthComponent;
  let fixture: ComponentFixture<AllordersbymonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllordersbymonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllordersbymonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
