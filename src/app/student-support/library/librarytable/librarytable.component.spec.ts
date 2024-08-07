import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarytableComponent } from './librarytable.component';

describe('LibrarytableComponent', () => {
  let component: LibrarytableComponent;
  let fixture: ComponentFixture<LibrarytableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrarytableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrarytableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
