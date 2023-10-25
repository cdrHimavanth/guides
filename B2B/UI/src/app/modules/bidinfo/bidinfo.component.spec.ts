import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidinfoComponent } from './bidinfo.component';

describe('BidinfoComponent', () => {
  let component: BidinfoComponent;
  let fixture: ComponentFixture<BidinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
