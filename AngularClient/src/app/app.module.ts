import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';
import { DashboardComponent } from './dashboard';
import { DashboardEnsemblesComponent, DashEnsembleAddDialog } from './dashboard-ensembles/dashboard-ensembles.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AssignStudentsComponent } from './ensemble-detail/assign-students/assign-students.component';
import { EnsembleDetailComponent } from './ensemble-detail/ensemble-detail.component';
import { HomeComponent } from './home';
import { InstrumentDetailComponent } from './instrument-detail/instrument-detail.component';
import { InstrumentInfoFormComponent } from './instrument-detail/instrument-info-form/instrument-info-form.component';
import { InstrumentAssignDialog, InstrumentsComponent, OverviewDialog } from './instruments';
import { LoginComponent } from './login';
import { MaterialsModule } from './materials-module/materials-module.module';
import { RegisterComponent } from './register';
import { StudentPageComponent } from './student-page/student-page.component';
import { CreateUniformDialog, UniformsComponent } from './uniforms/uniforms.component';
import { AlertComponent } from './_components';
import { ErrorInterceptor, JwtInterceptor, CsrfInterceptor } from './_helpers';
import { LockerInfoComponent } from './instrument-detail/locker-info/locker-info.component';
import { GraphQLModule } from './graphql.module';
import { AssignmentHistoryComponent } from './instrument-detail/assignment-history/assignment-history.component';
import { CostHistoryComponent } from './instrument-detail/cost-history/cost-history.component';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        BrowserAnimationsModule,
        MaterialsModule,
        GraphQLModule
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
        DashEnsembleAddDialog,
        AssignStudentsComponent,
        InstrumentAssignDialog,
        StudentPageComponent,
        CreateUniformDialog,
        InstrumentDetailComponent,
        InstrumentInfoFormComponent,
        LockerInfoComponent,
        AssignmentHistoryComponent,
        CostHistoryComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
