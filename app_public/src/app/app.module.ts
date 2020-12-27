import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Modules */
import { AppRoutingModule } from './modules/app-routing/app-routing.module';

/* Components */
import { SigninComponent } from './common/components/signin/signin.component';
import { PrivateComponent } from './common/components/private/private.component';
import { ProfileComponent } from './common/components/profile/profile.component';
import { WorldComponent} from './common/components/world/world.component';
import { NavComponent } from './common/components/nav/nav.component';
import { FrameComponent } from './common/components/frame/frame.component';
import { DbComponent } from './common/components/db/db.component';

/* Pipes */
import { IsActivePipe } from './common/pipes/is-active.pipe';
import { CheckedPipe } from './common/pipes/checked.pipe';
import { ShortenPipe } from './common/pipes/shorten.pipe';
import { ToFahrenheitPipe } from './common/pipes/to-fahrenheit.pipe';


@NgModule({
  declarations: [
    SigninComponent,
    PrivateComponent,
    ProfileComponent,
    WorldComponent,
    NavComponent,
    FrameComponent,
    IsActivePipe,
    CheckedPipe,
    ShortenPipe,
    DbComponent,
    ToFahrenheitPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [FrameComponent]
})

export class AppModule { }

