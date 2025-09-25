import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // Basic Component Tests
  describe('Component Basics', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should match initial snapshot', () => {
      expect(fixture.nativeElement).toMatchSnapshot();
    });
  });

  // Menu State Tests
  describe('Menu State', () => {
    it('should start with closed menu', () => {
      expect(component.isMenuOpen).toBe(false);
    });

    it('should toggle menu state', () => {
      // Initial state
      expect(component.isMenuOpen).toBe(false);
      
      // First toggle
      component.toggleMenu();
      expect(component.isMenuOpen).toBe(true);
      expect(fixture.nativeElement).toMatchSnapshot('menu-open');
      
      // Second toggle
      component.toggleMenu();
      expect(component.isMenuOpen).toBe(false);
      expect(fixture.nativeElement).toMatchSnapshot('menu-closed');
    });
  });

  // Navigation Tests
  describe('Navigation', () => {
    it('should navigate to specified route', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const testRoute = '/test-route';
      
      component.navigateTo(testRoute);
      
      expect(navigateSpy).toHaveBeenCalledWith([testRoute]);
    });

    it('should close menu when navigating', () => {
      // Open menu
      component.isMenuOpen = true;
      
      // Navigate
      component.navigateTo('/any-route');
      
      // Check menu closed
      expect(component.isMenuOpen).toBe(false);
    });
  });

  // User Interaction Tests
  describe('User Interactions', () => {
    it('should handle menu toggle button click', () => {
      // Spy on toggleMenu method
      const toggleSpy = jest.spyOn(component, 'toggleMenu');
      
      // Initial state snapshot
      expect(fixture.nativeElement).toMatchSnapshot('before-click');
      
      // Find and click toggle button
      const button = fixture.debugElement.query(By.css('button')); // Update selector based on your actual button element
      if (button) {
        button.triggerEventHandler('click', null);
        fixture.detectChanges();
        
        // Verify method was called
        expect(toggleSpy).toHaveBeenCalled();
        
        // Snapshot after click
        expect(fixture.nativeElement).toMatchSnapshot('after-click');
      }
    });
  });

  // Navigation Link Tests
  describe('Navigation Links', () => {
    it('should handle navigation link clicks', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const testRoute = '/test-route';
      
      // Initial state snapshot
      expect(fixture.nativeElement).toMatchSnapshot('before-navigation');
      
      // Simulate navigation
      component.navigateTo(testRoute);
      fixture.detectChanges();
      
      // Verify navigation occurred
      expect(navigateSpy).toHaveBeenCalledWith([testRoute]);
      
      // Snapshot after navigation
      expect(fixture.nativeElement).toMatchSnapshot('after-navigation');
    });
  });
});