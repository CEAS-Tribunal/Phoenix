import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecMainPageComponent } from './exec-main-page.component';

describe('ExecMainPageComponent', () => {
  let component: ExecMainPageComponent;
  let fixture: ComponentFixture<ExecMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
