import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditkeyprogramdateComponent } from './editkeyprogramdate.component';

describe('EditkeyprogramdateComponent', () => {
  let component: EditkeyprogramdateComponent;
  let fixture: ComponentFixture<EditkeyprogramdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditkeyprogramdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditkeyprogramdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
