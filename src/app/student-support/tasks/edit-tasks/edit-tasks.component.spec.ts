import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTasksComponent } from './edit-tasks.component';

describe('EditTasksComponent', () => {
  let component: EditTasksComponent;
  let fixture: ComponentFixture<EditTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
