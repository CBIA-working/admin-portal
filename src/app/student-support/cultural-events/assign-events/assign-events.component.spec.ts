import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEventsComponent } from './assign-events.component';

describe('AssignEventsComponent', () => {
  let component: AssignEventsComponent;
  let fixture: ComponentFixture<AssignEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
