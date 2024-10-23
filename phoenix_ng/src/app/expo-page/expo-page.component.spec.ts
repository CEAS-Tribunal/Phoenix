import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpoPageComponent } from './expo-page.component';

describe('ExpoPageComponent', () => {
  let component: ExpoPageComponent;
  let fixture: ComponentFixture<ExpoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
