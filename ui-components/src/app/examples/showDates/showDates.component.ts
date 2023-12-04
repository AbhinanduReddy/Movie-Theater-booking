import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';
import { TheaterService } from 'app/services/theater.service';

@Component({
  selector: 'app-showdates',
  templateUrl: './showDates.component.html',
  styleUrls: ['./showDates.component.css']
})
export class ShowDatesComponent implements OnInit {
  items: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  movieDetails: any;
  currentDate: Date = new Date();
  dates: Date[] = [];
  selectedDate: Date | null = null; // Store the selected date
  show_times: [];
  constructor(public auth:AuthenticationService, private router: Router, private http: HttpClient,private theaterSvc: TheaterService) { }


  ngOnInit() {
    this.selectedDate = this.currentDate;
    this.generateDates();
    //this.fetchMovieDetails();
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    const movieId = this.theaterSvc.selected_movie;
    const params = new HttpParams()
    .set('movie_id', this.theaterSvc.selected_movie) // Add your parameters here
    .set('theater_id', this.theaterSvc.selected_theater);
    this.http.get('/api/theaters/show_time',{params}).subscribe((res: any)=>{
        this.show_times = res;
    });
  //   this.http.get(`/api/movies/details/${movieId}`).subscribe((res: any) => {
  //     this.movieDetails = res;
  // });
}


selectShowTime(st:any){
  console.log(st);
  this.theaterSvc.selected_screen=st;
  this.theaterSvc.selected_date=this.selectedDate;
  this.router.navigate(['/seats']);

}
 ngOnDestroy(){
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
}

  generateDates() {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i <= 6; i++) { // Display 7 days, including today
      const newDate = new Date(this.currentDate);
      newDate.setDate(this.currentDate.getDate() + i);
      if (newDate >= today) {
        dates.push(newDate);
      }
      //this.dates.push(newDate);
    }
    this.dates = dates;
  }


  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  // getFormattedDate(date: Date): string {
  //   const options: Intl.DateTimeFormatOptions = {
  //     weekday: 'short',
  //     month: 'short',
  //     day: 'numeric',
  //   };
  //   if (this.isToday(date)) {
  //     return 'Today, ' + date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  //   } else {
  //     return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  //   }
  // }

  getFormattedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
  
    if (this.isToday(date)) {
      return 'Today, ' + date.toLocaleDateString('en-US', options);
    } else {
      return date.toLocaleDateString('en-US', options);
    }
  }

  selectDate(date: Date) {
    this.selectedDate = date; // Set the selected date when a date is clicked
  }

  isDateSelected(date: Date): boolean {
    return this.selectedDate !== null && date.getTime() === this.selectedDate.getTime();
  }
}
