import { Routes } from '@angular/router';
import { ExpoPageComponent } from './expo-page/expo-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AlumniPageComponent } from './alumni-page/alumni-page.component';
import { CareerFairPageComponent } from './career-fair-page/career-fair-page.component';
import { ExecMainPageComponent } from './exec-main-page/exec-main-page.component';
import { ExecPageComponent } from './exec-page/exec-page.component';
import { ReimbursementPageComponent } from './reimbursement/reimbursement-page.component';
import { CommitteesPageComponent } from './committees-page/committees-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent }, //Home page routing and App Root
  { path: 'alumni', component: AlumniPageComponent },
  { path: 'expo', component: ExpoPageComponent },
  { path: 'career-fair', component: CareerFairPageComponent },
  { path: 'exec', component: ExecMainPageComponent },
  { path: 'exec-info', component: ExecPageComponent },
  { path: 'reimbursement', component: ReimbursementPageComponent },
  { path: 'committees', component: CommitteesPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route for a 404 page (optional)
];
