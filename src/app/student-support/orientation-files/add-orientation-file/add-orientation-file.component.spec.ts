import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrientationFileComponent } from './add-orientation-file.component';

describe('AddOrientationFileComponent', () => {
  let component: AddOrientationFileComponent;
  let fixture: ComponentFixture<AddOrientationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrientationFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrientationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
