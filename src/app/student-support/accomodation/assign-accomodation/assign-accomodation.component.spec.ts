import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAccomodationComponent } from './assign-accomodation.component';

describe('AssignAccomodationComponent', () => {
  let component: AssignAccomodationComponent;
  let fixture: ComponentFixture<AssignAccomodationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignAccomodationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignAccomodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
