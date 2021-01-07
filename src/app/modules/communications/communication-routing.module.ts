import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { NavComponent } from '../homes/nav/nav.component';

// import { FiltersComponent } from './componets/filters/filters.component';

import { RegisterComponent } from '../homes/body/membership/register/register.component';
import { RegisterOkComponent } from '../homes/body/membership/register/register-ok/register-ok.component';
import { LoginComponent } from '../homes/body/membership/login/login.component';
// import { EventsComponent} from '../homes/body/membership/events/events.component';
import { AuthGuard } from './fe-backend-db/membership/auth.guard';
import { SocialRegisterComponent } from '../homes/body/membership/register/social-register/social-register.component';
import { UserpageComponent } from '../homes/body/membership/userpage/userpage.component';
import { ControlComponent } from '../homes/body/membership/control/control.component';
import { ApiRegisterComponent } from '../homes/body/membership/register/api-register/api-register.component';

const routes: Routes = [
  // {
  //   path : '',
  //   component : HeaderContainerComponent
  // },add : redirect to main page
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'register-ok',
    component: RegisterOkComponent,
    canActivate: [AuthGuard]

  }, {
    path: 'socReg',
    component: SocialRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'api-register',
    component: ApiRegisterComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  // { path: 'event',
  //   component: EventsComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'userpage',
    component: UserpageComponent
  },
  {
    path: 'control',
    component: ControlComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
