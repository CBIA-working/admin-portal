import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityHandbookComponent } from './city-handbook.component';

describe('CityHandbookComponent', () => {
  let component: CityHandbookComponent;
  let fixture: ComponentFixture<CityHandbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityHandbookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityHandbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
