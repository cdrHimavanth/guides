import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDeclineUploadComponent } from './candidate-decline-upload.component';

describe('CandidateDeclineUploadComponent', () => {
  let component: CandidateDeclineUploadComponent;
  let fixture: ComponentFixture<CandidateDeclineUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDeclineUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateDeclineUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
