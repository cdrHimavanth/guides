import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBidinfoComponent } from './edit-bidinfo.component';

describe('EditBidinfoComponent', () => {
  let component: EditBidinfoComponent;
  let fixture: ComponentFixture<EditBidinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBidinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBidinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
