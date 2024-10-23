import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerFairPageComponent } from './career-fair-page.component';

describe('CareerFairPageComponent', () => {
  let component: CareerFairPageComponent;
  let fixture: ComponentFixture<CareerFairPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerFairPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerFairPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
