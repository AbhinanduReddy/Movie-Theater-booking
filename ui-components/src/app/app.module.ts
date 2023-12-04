import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './examples/examples.module';
import { HttpClientModule } from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import { SidebarModule } from 'primeng/sidebar';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {TabViewModule} from 'primeng/tabview';
import {AccordionModule} from 'primeng/accordion';   
import { NgChartsModule } from 'ng2-charts';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { TransactionHistoryModalComponent } from './transaction-history-modal/transaction-history-modal.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { UserLandingComponent } from './user-landing/user-landing.component';
import { theaterOperationComponent } from './examples/theaterOperation/theaterOperation.component';
import { AdminComponent } from './examples/admin/admin.component';
import { discountComponent } from './examples/discount/discount.component';

@NgModule({
    declarations: [
        
        AppComponent,
        NavbarComponent,
        TransactionHistoryModalComponent,
        UserDashboardComponent,
        UserSidebarComponent,
        UserLandingComponent,
    ],
    imports: [
        BrowserModule,
        NgChartsModule ,
        ChartModule,
        BrowserAnimationsModule,
        TabViewModule,
        NgbModule,
        SidebarModule,
        FormsModule,
        RouterModule,
        TableModule,
        CardModule,
        AppRoutingModule,
        AccordionModule,
        ComponentsModule,
        ExamplesModule,
        HttpClientModule,
        OverlayPanelModule,
        ButtonModule,
        AutoCompleteModule,
        DropdownModule,
        DialogModule,
        TableModule,

    ],
    providers: [],
   
    bootstrap: [AppComponent]
})
export class AppModule { }
