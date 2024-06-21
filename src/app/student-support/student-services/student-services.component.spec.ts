import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentServicesComponent } from './student-services.component';

describe('StudentServicesComponent', () => {
  let component: StudentServicesComponent;
  let fixture: ComponentFixture<StudentServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
