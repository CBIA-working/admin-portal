import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPortalUserComponent } from './edit-portal-user.component';

describe('EditPortalUserComponent', () => {
  let component: EditPortalUserComponent;
  let fixture: ComponentFixture<EditPortalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPortalUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPortalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
