import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMultipleComponent } from './graph-multiple.component';

describe('GraphMultipleComponent', () => {
  let component: GraphMultipleComponent;
  let fixture: ComponentFixture<GraphMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphMultipleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
