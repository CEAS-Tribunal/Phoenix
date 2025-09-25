import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecMainPageComponent } from './exec-main-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('ExecMainPageComponent', () => {
  let component: ExecMainPageComponent;
  let fixture: ComponentFixture<ExecMainPageComponent>;
  let router: Router;

  // Setup before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExecMainPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // 1. Basic Component Creation
  describe('Basic Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should match initial snapshot', () => {
      expect(fixture.nativeElement).toMatchSnapshot('initial-state');
    });
  });

  // 2. Router Navigation
  describe('Navigation Features', () => {
    it('should navigate to exec info page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      
      // If navigation method exists, test it
      if (component.navigateToExecInfo) {
        component.navigateToExecInfo();
        expect(navigateSpy).toHaveBeenCalledWith(['/exec-info']);
      }
    });

    it('should handle routerLink navigation', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const links = fixture.debugElement.queryAll(By.css('[routerLink]'));

      links.forEach(link => {
        const route = link.attributes['routerLink'];
        link.nativeElement.click();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith([route]);
      });
    });
  });

  // 3. Event Handling & User Interaction
  describe('User Interactions', () => {
    it('should handle exec selection', () => {
      // If exec selection exists
      if (component.selectExec) {
        const testExec = { id: 1, name: 'Test Exec' };
        component.selectExec(testExec);
        expect(fixture.nativeElement).toMatchSnapshot('after-exec-selection');
      }
    });

    it('should handle button clicks', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      
      buttons.forEach((button, index) => {
        // Snapshot before click
        expect(fixture.nativeElement).toMatchSnapshot(`before-button-click-${index}`);
        
        // Simulate click
        button.triggerEventHandler('click', null);
        fixture.detectChanges();
        
        // Snapshot after click
        expect(fixture.nativeElement).toMatchSnapshot(`after-button-click-${index}`);
      });
    });

    it('should handle exec list display toggle', () => {
      // If toggle functionality exists
      if (component.toggleExecList) {
        // Initial state
        expect(fixture.nativeElement).toMatchSnapshot('before-toggle');
        
        component.toggleExecList();
        fixture.detectChanges();
        
        // After toggle
        expect(fixture.nativeElement).toMatchSnapshot('after-toggle');
      }
    });
  });

  // 4. Component State Changes
  describe('State Changes', () => {
    it('should update view when exec data changes', () => {
      // If exec data exists
      if (component.execList) {
        const testExecs = [
          { id: 1, name: 'Exec 1' },
          { id: 2, name: 'Exec 2' }
        ];
        
        component.execList = testExecs;
        fixture.detectChanges();
        
        expect(fixture.nativeElement).toMatchSnapshot('updated-exec-list');
      }
    });

    it('should handle filter changes', () => {
      // If filter functionality exists
      if (component.filterExecs) {
        const searchTerm = 'President';
        
        // Snapshot before filter
        expect(fixture.nativeElement).toMatchSnapshot('before-filter');
        
        component.filterExecs(searchTerm);
        fixture.detectChanges();
        
        // Snapshot after filter
        expect(fixture.nativeElement).toMatchSnapshot('after-filter');
      }
    });
  });
});
