import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import * as $ from 'jquery';

/* Modules */
import { AppRoutingModule } from './modules/app-routing/app-routing.module';

/* Components */
import { RegisterComponent } from './common/components/register/register.component';
import { SigninComponent } from './common/components/signin/signin.component';
import { PrivateComponent } from './common/components/private/private.component';
import { ProfileComponent } from './common/components/profile/profile.component';
import { WorldComponent} from './common/components/world/world.component';
import { NavComponent } from './common/components/nav/nav.component';
import { FrameComponent } from './common/components/frame/frame.component';

/* Pipes */
import { IsActivePipe } from './common/pipes/is-active.pipe';
import { CheckedPipe } from './common/pipes/checked.pipe';
import { RoomComponent } from './common/components/room/room.component';



@NgModule({
  declarations: [
    RegisterComponent,
    SigninComponent,
    PrivateComponent,
    ProfileComponent,
    WorldComponent,
    NavComponent,
    FrameComponent,
    IsActivePipe,
    CheckedPipe,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
 //   $
  ],
  providers: [],
  bootstrap: [FrameComponent]
})

export class AppModule { }

