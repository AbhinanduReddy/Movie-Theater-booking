import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';
import { TheaterService } from 'app/services/theater.service';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.css']
})
export class SeatsComponent implements OnInit {
  onlineServicefee = 0;
  totalCost = 0;
  block_seats = [];
  total = 0;
  rewardsUsed = 0;
  selectedValues;
  confirmationVisible: boolean = false;
  currentDate: Date = new Date();
  dates: Date[] = [];
  selectedDate: Date | null = null; // Store the selected date
  show_times: [];
  display = false;
  isTue=false;
  discountPercentage = 0;
  tueDiscount = false;
  sixPMDiscount = false;
  discountValue =0;
  isbeforeSix = false;
  combinedTimestamp: any;
  constructor(public auth: AuthenticationService, private router: Router, private http: HttpClient, public theaterSvc: TheaterService) { }

  confirmationData = {
    movieTitle: '', // You'll replace this with actual data
    showDate: new Date(),
    showTime: '',
    seats: [],
    totalCost: 0,
    rewardsUsed: 0
  };


  ngOnInit() {
    console.log('opay');
    console.log(this.theaterSvc.selected_date);
    console.log(this.theaterSvc.selected_screen.show_time)
    const calendar = new Date(this.theaterSvc.selected_date);
    const show_time = new Date(this.theaterSvc.selected_screen.show_time);
    // Extract date from calendar and time from show_time
     this.combinedTimestamp = new Date(
      calendar.getFullYear(),
      calendar.getMonth(),
      calendar.getDate(),
      show_time.getUTCHours(),
      show_time.getUTCMinutes(),
      show_time.getUTCSeconds(),
      show_time.getUTCMilliseconds()
    ).toISOString();
    const targetTime = new Date(this.combinedTimestamp);
    targetTime.setHours(18,0,0,0);
    const ct = new Date(this.combinedTimestamp);
    ct.setHours(ct.getHours() - 8);

    ct.getHours()<18?this.isbeforeSix=true:this.isbeforeSix=false;
    if(targetTime.getDay()===2){
      this.isTue = true;
    }
    console.log(ct);
    console.log(targetTime);
    console.log(this.isTue,this.isbeforeSix);
    let params = new HttpParams();
    params = params.append('movie_id', this.theaterSvc.selected_movie);
    params = params.append('theater_id', this.theaterSvc.selected_theater);
    params = params.append('screen_id', this.theaterSvc.selected_screen.screen_id);
    params = params.append('show_time', this.combinedTimestamp);


    this.http.get('/api/theaters/booked_seats', { params }).subscribe(
      (data: any) => {
        this.block_seats = data;
      }
    );

    this.http.get('/api/theaters/theater_screen/seats', { params }).subscribe((res) => {
      this.rows = res[0].rows;
      this.columns = res[0].columns;
    })

    this.http.get('/api/ticket/discount').subscribe((res: any)=>{
      this.tueDiscount = res?.discount?.tuesday?true:false;
      this.sixPMDiscount = res?.discount?.sixPM?true:false;
      this.discountPercentage = res?.percentage;
    })
    console.log(this.generateSeatMatrix());

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

  }

  ngOnDestroy() {
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }
  rows = 0; // Number of rows
  columns = 0; // Number of columns
  selectedSeats: any[] = [];

  generateSeatMatrix(): number[][] {
    return Array.from({ length: this.rows }, (_, row) =>
      Array.from({ length: this.columns }, (_, col) => row * this.columns + col + 1)
    );
  }

  toggleSelection(seatNumber: number) {
    const index = this.selectedSeats.indexOf(seatNumber);

    if (index === -1) {
      this.selectedSeats.push(seatNumber);
    } else {
      this.selectedSeats.splice(index, 1);
    }
    console.log(this.auth.user?.role, 'pretest')
    if (this.auth.user?.role !== 'premium') {
      this.onlineServicefee = 1.5;
    }
    console.log(this.theaterSvc.selected_screen);
    console.log('discoutn check')
    console.log(this.tueDiscount,this.isTue,this.isbeforeSix,this.sixPMDiscount)
    if((this.tueDiscount && this.isTue) || (this.isbeforeSix && this.sixPMDiscount)) {
      this.discountValue = this.theaterSvc.selected_screen.cost * this.selectedSeats.length* ( this.discountPercentage/ 100);
    }
    this.totalCost = this.theaterSvc.selected_screen.cost * this.selectedSeats.length - this.discountValue;
  }

  isSeatSelected(seatNumber: number) {
    return this.selectedSeats.includes(seatNumber);
  }
  isSeatBlocked(seat: string): boolean {
    return this.block_seats.includes(+seat);
  }
  Book() {
    this.total = this.totalCost + this.onlineServicefee;
    this.display = true;
  }
  Pay() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.auth.user?.token) {
      headers = headers.set('Authorization', this.auth.user.token);
    }
    
    const body = {
      "movie_id": this.theaterSvc.selected_movie,
      "show_time": this.combinedTimestamp,
      "screen_id": this.theaterSvc.selected_screen.screen_id,
      "seats": this.selectedSeats,
      "total_cost": this.totalCost + this.onlineServicefee,
      "rewards_used": this.rewardsUsed,
      "theater_id": this.theaterSvc.selected_theater
    };

    this.http.post('/api/ticket', body, { headers }).subscribe(async (res) => {
      console.log(res);

      // Update confirmation data here
      this.confirmationData = {
        movieTitle: this.theaterSvc.selected_movie.title, // Update this with the actual title property
        showDate: this.theaterSvc.selected_date,
        showTime: this.combinedTimestamp,
        seats: this.selectedSeats,
        totalCost: this.totalCost,
        rewardsUsed: this.rewardsUsed
      };

      // Show confirmation dialog
      this.confirmationVisible = true;

      // Handle user rewards update and navigation
      if (this.auth.user?.token) {
        this.http.get('/api/user/rewards', { headers }).subscribe((res: any) => {
          this.auth.user.rewards = res.rewards;
          // Consider moving navigation so it only happens once the dialog is closed
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }
  afterConfirmationClose() {
    // Here you can handle what happens after the dialog is closed
    // For instance, navigate away or reset the component state
    this.router.navigate(['/']); // This navigates to the home page
  }
  checkboxselection($event) {
    console.log($event);
    if ($event.checked.length > 0) {
      if (this.total > this.auth.user?.rewards) {
        this.total = this.total - this.auth.user?.rewards;
        this.rewardsUsed = this.auth.user?.rewards;
      }
      else {
        this.rewardsUsed = this.total;
        this.total = 0;
      }
    }
    else {
      this.total = this.total + this.rewardsUsed;
      this.rewardsUsed = 0;
    }
  }

}


