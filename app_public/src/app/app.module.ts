import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from "ng2-charts";

/* Modules */
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';


/* Components */
import { SigninComponent } from './common/components/signin/signin.component';
import { PrivateComponent } from './common/components/private/private.component';
import { ProfileComponent } from './common/components/profile/profile.component';
import { WorldComponent } from './common/components/world/world.component';
import { NavComponent } from './common/components/nav/nav.component';
import { FrameComponent } from './common/components/frame/frame.component';
import { DbComponent } from './common/components/db/db.component';
import { GraphAndDataComponent } from './common/components/graph-and-data/graph-and-data.component';
import { LineChartComponent } from './common/components/line-chart/line-chart.component';

/* Pipes */
import { IsActivePipe } from './common/pipes/is-active.pipe';
import { CheckedPipe } from './common/pipes/checked.pipe';
import { ShortenPipe } from './common/pipes/shorten.pipe';
import { ToFahrenheitPipe } from './common/pipes/to-fahrenheit.pipe';

import { GetHoursAndMinutesPipe } from './common/pipes/get-hours-and-minutes.pipe';


import { ModalnoOknoComponent } from './common/components/modalno-okno/modalno-okno.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OldestFirstPipe } from './common/pipes/oldest-first.pipe';

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
    ToFahrenheitPipe,
    GraphAndDataComponent,
    GetHoursAndMinutesPipe,
    LineChartComponent,
    ModalnoOknoComponent,
    OldestFirstPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ChartsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [FrameComponent]
})

export class AppModule { }

