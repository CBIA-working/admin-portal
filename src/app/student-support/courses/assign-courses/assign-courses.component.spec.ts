import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCoursesComponent } from './assign-courses.component';

describe('AssignCoursesComponent', () => {
  let component: AssignCoursesComponent;
  let fixture: ComponentFixture<AssignCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
