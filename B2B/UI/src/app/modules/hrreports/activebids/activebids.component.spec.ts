import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivebidsComponent } from './activebids.component';

describe('ActivebidsComponent', () => {
  let component: ActivebidsComponent;
  let fixture: ComponentFixture<ActivebidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivebidsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivebidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
