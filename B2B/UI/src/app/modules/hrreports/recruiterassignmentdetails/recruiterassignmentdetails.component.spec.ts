import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterassignmentdetailsComponent } from './recruiterassignmentdetails.component';

describe('RecruiterassignmentdetailsComponent', () => {
  let component: RecruiterassignmentdetailsComponent;
  let fixture: ComponentFixture<RecruiterassignmentdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterassignmentdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterassignmentdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
