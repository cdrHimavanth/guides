import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsbyskillComponent } from './positionsbyskill.component';

describe('PositionsbyskillComponent', () => {
  let component: PositionsbyskillComponent;
  let fixture: ComponentFixture<PositionsbyskillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionsbyskillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionsbyskillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
