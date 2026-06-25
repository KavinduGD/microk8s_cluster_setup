import { Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';

export const routes: Routes = [
  { path: '', component: UserDashboardComponent },
  { path: '**', redirectTo: '' },
];
