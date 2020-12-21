import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { WorldComponent } from '../../common/components/world/world.component';
import { RegisterComponent } from '../../common/components/register/register.component';
import { SigninComponent } from '../../common/components/signin/signin.component';
import { PrivateComponent } from '../../common/components/private/private.component';
import { ProfileComponent } from '../../common/components/profile/profile.component';

const paths: Routes = [
  { // validate cookie? index : register
    path: '',
    component: WorldComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'private',
    component: PrivateComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'logout',
    component: SigninComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(paths)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
