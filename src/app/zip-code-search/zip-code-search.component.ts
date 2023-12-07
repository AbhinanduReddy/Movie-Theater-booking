import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TheaterService } from 'app/services/theater.service';

@Component({
  selector: 'app-zip-code-search',
  templateUrl: './zip-code-search.component.html',
  styleUrls: ['./zip-code-search.component.css']
})
export class ZipCodeSearchComponent implements OnInit {

  zipCode: string = '';
  theater:any;
  theater_list=[];
  cities=[];
  selectedCity;
  constructor(public theaterService: TheaterService,private http:HttpClient) { 
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
  }

  ngOnInit(): void {
    this.theater_list = this.theaterService.theaters_list_location;
    // console.log('ngonint');
    // console.log(this.theater_list);
  }
  theaterSelected($event){
    console.log($event.value);
    this.theaterService.selected_theater=$event.value.theater_id;
    this.http.get('/api/movies/theater/'+$event.value.theater_id).subscribe((res: any)=>{
      this.theaterService.show_movie_list=res;
      console.log(this.theaterService.show_movie_list);
    })
  }
}
