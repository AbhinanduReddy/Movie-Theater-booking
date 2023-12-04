import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsComponent } from './components/components.component';

import { LoginComponent } from './examples/login/login.component';
import { ProfileComponent } from './examples/profile/profile.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { RegisterComponent } from './examples/register/resgister.component';
import { ShowDatesComponent } from './examples/showDates/showDates.component';
import { SeatsComponent } from './examples/seats/seats.component';
import { AdminComponent } from './examples/admin/admin.component';
import { UserLandingComponent } from './user-landing/user-landing.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

const routes: Routes =[
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index',                component: ComponentsComponent },
    { path: 'nucleoicons',          component: NucleoiconsComponent },
    { path: 'login',       component: LoginComponent },
    { path: 'register',       component: RegisterComponent },
    { path: 'show_times',       component: ShowDatesComponent },
    { path: 'seats',       component: SeatsComponent },
    { path: 'admin',       component: AdminComponent }, 
    { path: 'examples/profile',     component: ProfileComponent },
    { path: 'examples/profile',     component: ProfileComponent },
    { path: 'user-dashboard',     component: UserDashboardComponent },
    { path: 'user-landing',        component: UserLandingComponent}

];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
