import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit} from '@angular/core';
import { TheaterService } from 'app/services/theater.service';

import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    providers: [MessageService]

})
export class analyticsComponent implements OnInit {
    @Input() movies: [];
    location_analytic: any;
    movie_analytics: any
    dayslist = [
        {name: '30 Days', value: 30},
        {name: '60 Days', value: 60},
        {name: '90 Days', value: 90}
    ]
    days= 30;
    dataLoc = {
        locationData: {
          labels: [],
          datasets: [
            {
              label: 'Location ID vs Total Seats',
              data: []
            }
          ]
        },
        movieData: {
          labels: [],
          datasets: [
            {
              label: 'Movie ID vs Total Seats',
              data: []
            }
          ]
        }
      };
      dataMov = {
        locationData: {
          labels: [],
          datasets: [
            {
              label: 'Location ID vs Total Seats',
              data: []
            }
          ]
        },
        movieData: {
          labels: [],
          datasets: [
            {
              label: 'Movie ID vs Total Seats',
              data: []
            }
          ]
        }
      };
    constructor(private http: HttpClient, private theaterSvc: TheaterService){
       
        
    }
    ngOnInit(): void {
        this.getAnalytics(this.days);
    }
    getLocationName(locationId: any): string {
        const location: any = this.theaterSvc.location_list.find((loc: any) => loc.location_id === locationId);
        return location.city;
      }
    
      getMovieName(movieId: number): string {
        const movie: any = this.movies.find((mov: any) => mov.movie_id === movieId);
        return movie.movie_name;
      }

    getAnalytics(days: any){
        let params = new HttpParams();
        params = params.append('days',days);
        this.http.get('/api/ticket/analytics/movie',{params}).subscribe((res: any)=>{
            console.log(res);
            // this.location_analytic = this.getLocationSeatData();
            // this.movie_analytics = this.getMovieSeatData();
            // this.analytics = {
            //     "labels": res.map((r)=>r.location_id)
            // } 
            this.dataMov = {
                locationData: {
                  labels: [],
                  datasets: [
                    {
                      label: 'Location ID vs Total Seats',
                      data: []
                    }
                  ]
                },
                movieData: {
                  labels: [],
                  datasets: [
                    {
                      label: 'Movie ID vs Total Seats',
                      data: []
                    }
                  ]
                }
              };
            
            for (const item of res) {
           
          
                const movieName = this.getMovieName(item.movie_id);
                this.dataMov.movieData.labels.push(movieName);
                this.dataMov.movieData.datasets[0].data.push(parseInt(item.total_seats));
              }
              console.log(this.dataMov);
            
        })
        this.http.get('/api/ticket/analytics/location',{params}).subscribe((res: any)=>{
            console.log(res);
            // this.location_analytic = this.getLocationSeatData();
            // this.movie_analytics = this.getMovieSeatData();
            // this.analytics = {
            //     "labels": res.map((r)=>r.location_id)
            // } 
            this.dataLoc = {
                locationData: {
                  labels: [],
                  datasets: [
                    {
                      label: 'Location ID vs Total Seats',
                      data: []
                    }
                  ]
                },
                movieData: {
                  labels: [],
                  datasets: [
                    {
                      label: 'Movie ID vs Total Seats',
                      data: []
                    }
                  ]
                }
              };
            
            for (const item of res) {
                const locationName = this.getLocationName(item.location_id);
                this.dataLoc.locationData.labels.push(locationName);
                this.dataLoc.locationData.datasets[0].data.push(parseInt(item.total_seats));
          
            
              }
              console.log(this.dataLoc);
            
        })
    }

        
}
