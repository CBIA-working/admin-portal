import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccomodationComponent } from './add-accomodation.component';

describe('AddAccomodationComponent', () => {
  let component: AddAccomodationComponent;
  let fixture: ComponentFixture<AddAccomodationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccomodationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAccomodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
