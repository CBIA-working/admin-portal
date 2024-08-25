import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedStudentsComponent } from './assigned-students.component';

describe('AssignedStudentsComponent', () => {
  let component: AssignedStudentsComponent;
  let fixture: ComponentFixture<AssignedStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
