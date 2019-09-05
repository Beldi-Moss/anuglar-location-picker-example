import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {path: 'login', component: LoginComponent,  canActivate: [LoginGuard]},
    {path: '', component: DashboardComponent,   canActivate: [AuthGuard]},
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
