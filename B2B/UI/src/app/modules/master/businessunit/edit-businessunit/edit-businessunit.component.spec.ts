import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBusinessUnitComponent } from './edit-businessunit.component';

describe('EditBusinessUnitComponent', () => {
  let component: EditBusinessUnitComponent;
  let fixture: ComponentFixture<EditBusinessUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBusinessUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBusinessUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
