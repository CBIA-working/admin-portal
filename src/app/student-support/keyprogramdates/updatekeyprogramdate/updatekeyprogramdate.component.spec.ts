import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatekeyprogramdateComponent } from './updatekeyprogramdate.component';

describe('UpdatekeyprogramdateComponent', () => {
  let component: UpdatekeyprogramdateComponent;
  let fixture: ComponentFixture<UpdatekeyprogramdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatekeyprogramdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatekeyprogramdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
