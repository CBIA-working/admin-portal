import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPortalUserComponent } from './add-portal-user.component';

describe('AddPortalUserComponent', () => {
  let component: AddPortalUserComponent;
  let fixture: ComponentFixture<AddPortalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPortalUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPortalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
