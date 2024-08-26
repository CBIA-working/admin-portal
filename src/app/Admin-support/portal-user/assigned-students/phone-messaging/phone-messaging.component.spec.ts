import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneMessagingComponent } from './phone-messaging.component';

describe('PhoneMessagingComponent', () => {
  let component: PhoneMessagingComponent;
  let fixture: ComponentFixture<PhoneMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneMessagingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
