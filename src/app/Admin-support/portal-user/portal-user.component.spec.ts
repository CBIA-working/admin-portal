import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalUserComponent } from './portal-user.component';

describe('PortalUserComponent', () => {
  let component: PortalUserComponent;
  let fixture: ComponentFixture<PortalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
