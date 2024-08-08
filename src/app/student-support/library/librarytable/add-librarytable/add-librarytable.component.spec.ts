import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLibrarytableComponent } from './add-librarytable.component';

describe('AddLibrarytableComponent', () => {
  let component: AddLibrarytableComponent;
  let fixture: ComponentFixture<AddLibrarytableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLibrarytableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLibrarytableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
