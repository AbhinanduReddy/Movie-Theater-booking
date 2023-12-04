import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { AgmCoreModule } from '@agm/core';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ExamplesComponent } from './examples.component';
import { RegisterComponent } from './register/resgister.component';
import { ShowDatesComponent } from './showDates/showDates.component';
import {CardModule} from 'primeng/card';
import { SeatsComponent } from './seats/seats.component';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { AdminComponent } from './admin/admin.component';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext'; 
import {ToastModule} from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { theaterOperationComponent } from './theaterOperation/theaterOperation.component';
import {MultiSelectModule} from 'primeng/multiselect';
import { assignTheaterComponent } from './assignTheater/assignTheater.component';
import { discountComponent } from './discount/discount.component';
import {SliderModule} from 'primeng/slider';

import { MegaMenuModule } from 'primeng/megamenu';

@NgModule({
    imports: [
        SliderModule,
        MultiSelectModule,
        DropdownModule,
        ToastModule,
        CommonModule,
        FormsModule,
        NgbModule,
        TabViewModule,
        NouisliderModule,
        JwBootstrapSwitchNg2Module,
        CardModule,
        MegaMenuModule,
        CheckboxModule,
        TableModule,
        DialogModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        CalendarModule,
        InputTextModule,
        
        AgmCoreModule.forRoot({
            apiKey: 'YOUR_KEY_HERE'
        })
    ],
    declarations: [
        AdminComponent,
        LoginComponent,
        ExamplesComponent,
        ProfileComponent,
        RegisterComponent,
        ShowDatesComponent,
        SeatsComponent,
        theaterOperationComponent,
        assignTheaterComponent,
        discountComponent
    ]
})
export class ExamplesModule { }
