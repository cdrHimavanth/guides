import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDdComponent } from './upload-dd.component';

describe('UploadDdComponent', () => {
  let component: UploadDdComponent;
  let fixture: ComponentFixture<UploadDdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
