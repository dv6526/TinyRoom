import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { WorldComponent } from '../../common/components/world/world.component';
import { SigninComponent } from '../../common/components/signin/signin.component';
import { PrivateComponent } from '../../common/components/private/private.component';
import { ProfileComponent } from '../../common/components/profile/profile.component';

// TODO: catch any other invalid url
const paths: Routes = [
  {
    path: '',
    component: WorldComponent
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
