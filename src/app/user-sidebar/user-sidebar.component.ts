import { Component, OnInit } from '@angular/core';


declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
  { path: '/maps', title: 'Maps',  icon:'location_map-big', class: '' },
  { path: '/notifications', title: 'Notifications',  icon:'ui-1_bell-53', class: '' },
  { path: '/icons', title: 'Icons',  icon:'education_atom', class: '' },
  { path: '/user-profile', title: 'User Profile',  icon:'users_single-02', class: '' },
  

];

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent implements OnInit {
  menuItems!: any[];
  activeMenuItem: string = '';

setActive(path: string) {
    this.activeMenuItem = path;
}

isActive(path: string) {
    return this.activeMenuItem === path;
}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };

  constructor() { }


}
