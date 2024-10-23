import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecBlockComponent } from './exec-block.component';

describe('ExecBlockComponent', () => {
  let component: ExecBlockComponent;
  let fixture: ComponentFixture<ExecBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
