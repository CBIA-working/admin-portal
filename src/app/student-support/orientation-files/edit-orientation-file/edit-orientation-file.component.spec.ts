import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrientationFileComponent } from './edit-orientation-file.component';

describe('EditOrientationFileComponent', () => {
  let component: EditOrientationFileComponent;
  let fixture: ComponentFixture<EditOrientationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrientationFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrientationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
