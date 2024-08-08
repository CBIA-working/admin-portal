import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLibrarytableComponent } from './edit-librarytable.component';

describe('EditLibrarytableComponent', () => {
  let component: EditLibrarytableComponent;
  let fixture: ComponentFixture<EditLibrarytableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLibrarytableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLibrarytableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
