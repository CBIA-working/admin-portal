import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarkerComponent } from './edit-marker.component';

describe('EditMarkerComponent', () => {
  let component: EditMarkerComponent;
  let fixture: ComponentFixture<EditMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMarkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
