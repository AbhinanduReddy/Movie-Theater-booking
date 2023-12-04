import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthenticationService } from 'app/services/authentication.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TheaterService } from 'app/services/theater.service';
import { TransactionsService } from 'app/services/transactions.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';



@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    transactions = []; // Your transactions data
    showModal: boolean = false;
    private toggleButton: any;
    isLoading = true;
    loc ='';
    loc_list=[];
    filteredL=[];
    display =false;
    displayPremium=false;
    displayTransactions=false;
    private sidebarVisible: boolean;
    @ViewChild('op') overlayPanel: OverlayPanel;

    constructor( public location: Location, private element : ElementRef, public auth: AuthenticationService, private http: HttpClient, private theater: TheaterService,
        private transactionServc: TransactionsService, private router:Router) {
        this.sidebarVisible = false;
        this.http.get('/api/locations').subscribe((res:any)=>{ 
            this.loc_list=res;
            this.theater.location_list=res;
            console.log(this.loc_list)
            this.theater.location=this.loc_list[0];
            this.loc=this.loc_list[0].city;
            console.log('call theaters list')
            this.http.get('/api/theaters/location/'+this.theater.location.location_id).subscribe((res: any)=>{
                this.theater.theaters_list_location = res;
                console.log('location')
                console.log(this.theater.theaters_list_location)
            })
            
        })
    }


    showDisplay(){
        this.display = true;
    }

    locationSelected($event){
        this.loc= $event.value.city;
        this.theater.location=$event.value;
        this.display=false;
        this.http.get('/api/theaters/location/'+this.theater.location.location_id).subscribe((res: any)=>{
            this.theater.theaters_list_location = res;
        })
    }
    logout(){
        this.overlayPanel.hide();
        this.auth.logout();
    }

    ngOnInit() {
    
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    }

    
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
  
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }


    pay(){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' 
          });
        if(this.auth.user?.token){
          headers= headers.set('Authorization',this.auth.user.token);
        }
        console.log('paying..')
        this.http.put('/api/user/premium',{},{headers}).subscribe((res)=>{
            console.log(res);
            this.auth.user.role='premium';
            this.displayPremium=false;
        })
      }

    openTransactionHistory(): void {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' 
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        console.log('Fetching transactions...');

    this.http.get<any[]>('/api/ticket/transactions',{headers }).subscribe(
      (res) => {
        console.log(res);
        this.transactions = res;
        this.displayTransactions = true;
        console.log('Transactions fetched:', res);
      },
     );
    }
    //   transactionsOpen(){
    //     console.log('Opening transactions');
    //     this.displayTransactions=true;

    //   }
    //   closeTransactions() {
    //     this.displayTransactions = false;
    // }
    cancelBooking(ticketId: number): void {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }

        this.http.delete(`/api/ticket?ticket_id=${ticketId}`, { headers })
            .subscribe(
                (res) => {
                    console.log('Booking cancelled:', res);
                    // Update the local transaction list to reflect the cancellation
                    this.transactions = this.transactions.filter(transaction => transaction.ticket_id !== ticketId);
                }
            );
    }
  
    
        
    upgrade(){
        this.displayPremium=true;
    }
}
