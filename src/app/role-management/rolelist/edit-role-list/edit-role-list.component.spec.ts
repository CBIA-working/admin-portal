import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleListComponent } from './edit-role-list.component';

describe('EditRoleListComponent', () => {
  let component: EditRoleListComponent;
  let fixture: ComponentFixture<EditRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRoleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
