import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSubmissionUploadComponent } from './candidate-submission-upload.component';

describe('CandidateSubmissionUploadComponent', () => {
  let component: CandidateSubmissionUploadComponent;
  let fixture: ComponentFixture<CandidateSubmissionUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSubmissionUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateSubmissionUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
