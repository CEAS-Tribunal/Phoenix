import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // Basic Component Creation
  describe('Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should match initial snapshot', () => {
      expect(fixture.nativeElement).toMatchSnapshot();
    });
  });

  // Router Navigation Testing
  describe('Navigation', () => {
    it('should handle navigation through navigateTo method', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const testRoutes = [
        '/alumni',
        '/expo',
        '/career-fair',
        '/exec',
        '/exec-info'
      ];

      testRoutes.forEach(route => {
        // Test navigation for each route
        component.navigateTo(route);
        expect(navigateSpy).toHaveBeenCalledWith([route]);
      });
    });

    it('should handle routerLink navigation', () => {
      const routerLinks = fixture.debugElement.queryAll(By.css('[routerLink]'));
      const navigateSpy = jest.spyOn(router, 'navigate');

      routerLinks.forEach(link => {
        const route = link.attributes['routerLink'];
        link.nativeElement.click();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith([route]);
      });
    });
  });

  // User Interaction Testing
  describe('User Interactions', () => {
    it('should handle navigation button clicks', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const buttons = fixture.debugElement.queryAll(By.css('button'));

      buttons.forEach(button => {
        const route = button.attributes['data-route'];
        if (route) {
          button.nativeElement.click();
          fixture.detectChanges();
          expect(navigateSpy).toHaveBeenCalledWith([route]);
        }
      });
    });

    it('should handle link clicks', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const links = fixture.debugElement.queryAll(By.css('a'));

      links.forEach(link => {
        const route = link.attributes['routerLink'];
        if (route) {
          link.nativeElement.click();
          fixture.detectChanges();
          expect(navigateSpy).toHaveBeenCalledWith([route]);
        }
      });
    });
  });

  // Snapshot Testing with Different States
  describe('Snapshots', () => {
    it('should match snapshots for different routes', () => {
      const testRoutes = [
        '/alumni',
        '/expo',
        '/career-fair',
        '/exec',
        '/exec-info'
      ];

      testRoutes.forEach(route => {
        component.navigateTo(route);
        fixture.detectChanges();
        expect(fixture.nativeElement).toMatchSnapshot(`route-${route}`);
      });
    });
  });
});