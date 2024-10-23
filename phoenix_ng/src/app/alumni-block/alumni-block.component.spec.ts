import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumniBlockComponent } from './alumni-block.component';

describe('AlumniBlockComponent', () => {
  let component: AlumniBlockComponent;
  let fixture: ComponentFixture<AlumniBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumniBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumniBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
