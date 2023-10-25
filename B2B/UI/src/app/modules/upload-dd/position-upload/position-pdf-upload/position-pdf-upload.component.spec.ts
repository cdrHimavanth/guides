import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionPdfUploadComponent } from './position-pdf-upload.component';

describe('PositionPdfUploadComponent', () => {
  let component: PositionPdfUploadComponent;
  let fixture: ComponentFixture<PositionPdfUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionPdfUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionPdfUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
