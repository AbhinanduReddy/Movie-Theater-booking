import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TheaterService } from 'app/services/theater.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  movies: any[] = [];

  constructor(private http: HttpClient, public theaterSvc: TheaterService, private router: Router) {}
  ngOnInit(): void {
  
  }

  // ngOnInit(): void {
  //   this.http.get<any[]>('your-api-url').subscribe((data) => {
  //     this.movies = data;
  //   }, error => {
  //     console.error('There was an error retrieving the movie data', error);
  //   });
  // }

  MovieSelected(id){
    this.theaterSvc.selected_movie=id;
    this.router.navigate(['/show_times']);
  }
}
