import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationFilesComponent } from './orientation-files.component';

describe('OrientationFilesComponent', () => {
  let component: OrientationFilesComponent;
  let fixture: ComponentFixture<OrientationFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrientationFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrientationFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
