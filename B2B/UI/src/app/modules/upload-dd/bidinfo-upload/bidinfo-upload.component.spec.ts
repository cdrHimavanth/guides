import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidinfoUploadComponent } from './bidinfo-upload.component';

describe('BidinfoUploadComponent', () => {
  let component: BidinfoUploadComponent;
  let fixture: ComponentFixture<BidinfoUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidinfoUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidinfoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
