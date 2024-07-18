import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyprogramdatesComponent } from './keyprogramdates.component';

describe('KeyprogramdatesComponent', () => {
  let component: KeyprogramdatesComponent;
  let fixture: ComponentFixture<KeyprogramdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyprogramdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyprogramdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
