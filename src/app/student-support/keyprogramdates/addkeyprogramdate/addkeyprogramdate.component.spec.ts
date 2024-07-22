import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddkeyprogramdateComponent } from './addkeyprogramdate.component';

describe('AddkeyprogramdateComponent', () => {
  let component: AddkeyprogramdateComponent;
  let fixture: ComponentFixture<AddkeyprogramdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddkeyprogramdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddkeyprogramdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
