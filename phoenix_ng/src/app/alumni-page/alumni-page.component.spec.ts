import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumniPageComponent } from './alumni-page.component';

describe('AlumniPageComponent', () => {
  let component: AlumniPageComponent;
  let fixture: ComponentFixture<AlumniPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumniPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumniPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
