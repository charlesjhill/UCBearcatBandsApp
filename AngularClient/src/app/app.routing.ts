import { AdminGuard } from './_helpers/admin.guard';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_helpers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InstrumentsComponent } from './instruments/instruments.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { UniformsComponent } from './uniforms/uniforms.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AdminGuard],
      children: [
          { path: '', component: DashboardHomeComponent, pathMatch: 'full' },
          { path: 'instruments', component: InstrumentsComponent },
          { path: 'uniforms', component: UniformsComponent },
        //   { path: 'ensembles', component: DashboardEnsembleComponent },
        //   { path: 'students', component: DashboardStudentComponent }
      ] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
