import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './navigation/navigation.component';
import { NucleoiconsComponent } from './nucleoicons/nucleoicons.component';
import { ComponentsComponent } from './components.component';
import { NotificationComponent } from './notification/notification.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { ZipCodeSearchComponent } from 'app/zip-code-search/zip-code-search.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NouisliderModule,
        RouterModule,
        JwBootstrapSwitchNg2Module,
        DropdownModule
      ],
    declarations: [
        ComponentsComponent,
        NavigationComponent,
        NotificationComponent,
        MovieListComponent,
        ZipCodeSearchComponent
 
    ],
    exports:[ ComponentsComponent ]
})
export class ComponentsModule { }
