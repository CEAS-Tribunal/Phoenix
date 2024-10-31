import { Routes } from '@angular/router';
import { ExpoPageComponent } from './expo-page/expo-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AlumniPageComponent } from './alumni-page/alumni-page.component';
import { CareerFairPageComponent } from './career-fair-page/career-fair-page.component';
import { ExecMainPageComponent } from './exec-main-page/exec-main-page.component';
import { ExecPageComponent } from './exec-page/exec-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'alumni', component: AlumniPageComponent },
    { path: 'expo', component: ExpoPageComponent },
    { path: 'career-fair', component: CareerFairPageComponent },
    { path: 'exec', component: ExecMainPageComponent },
    { path: 'exec-info', component: ExecPageComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route for a 404 page (optional)
];
