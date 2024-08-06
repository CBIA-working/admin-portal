import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOrientationFileComponent } from './upload-orientation-file.component';

describe('UploadOrientationFileComponent', () => {
  let component: UploadOrientationFileComponent;
  let fixture: ComponentFixture<UploadOrientationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadOrientationFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadOrientationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
