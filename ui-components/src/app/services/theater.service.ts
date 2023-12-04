import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  location: any;
  theaters_list_location: [];
  selected_theater: any;
  selected_movie: any; 
  show_movie_list:[];
  selected_screen:any;
  selected_date:any;
  location_list: [];
  constructor(private http: HttpClient) { }
  

  getTheatersByZipCode(zipCode: string): Observable<any> {
    // Replace 'api_url' with the actual API URL that provides theater and movie data
    return this.http.get(`api_url/theaters?zipCode=${zipCode}`);
  }

  
}
