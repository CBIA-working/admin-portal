import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTripsComponent } from './assign-trips.component';

describe('AssignTripsComponent', () => {
  let component: AssignTripsComponent;
  let fixture: ComponentFixture<AssignTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignTripsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
