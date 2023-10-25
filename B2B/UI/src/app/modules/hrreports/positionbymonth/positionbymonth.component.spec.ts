import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionbymonthComponent } from './positionbymonth.component';

describe('PositionbymonthComponent', () => {
  let component: PositionbymonthComponent;
  let fixture: ComponentFixture<PositionbymonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionbymonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionbymonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
