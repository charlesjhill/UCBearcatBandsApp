import { MaterialsModule } from './materials-module/materials-module.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { appRoutingModule } from './app.routing';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { DashboardComponent } from './dashboard';
import { RegisterComponent } from './register';
import { AlertComponent } from './_components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'
import { InstrumentsComponent, OverviewDialog, InstrumentAssignDialog } from './instruments/instruments.component';
import { UniformsComponent } from './uniforms/uniforms.component';
import { DashboardEnsemblesComponent } from './dashboard-ensembles/dashboard-ensembles.component';
import { EnsembleDetailComponent } from './ensemble-detail/ensemble-detail.component';
import { StudentPageComponent } from './student-page/student-page.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        BrowserAnimationsModule,
        MaterialsModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        DashboardComponent,
        AlertComponent,
        DashboardHomeComponent,
        InstrumentsComponent,
        OverviewDialog,
        DashboardEnsemblesComponent,
        EnsembleDetailComponent,
        UniformsComponent,
        InstrumentAssignDialog,
        StudentPageComponent,
    ],
    entryComponents: [
      OverviewDialog,
      InstrumentAssignDialog,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
