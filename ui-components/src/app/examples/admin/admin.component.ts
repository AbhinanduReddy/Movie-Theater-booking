import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { TheaterService } from '../../services/theater.service';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    providers: [MessageService]

})
export class AdminComponent {
    assignTheaterOperation =false;
    selected_movie_id:any;
    location_th: any;
    theaterDiaplayForm = false;
    theaterOperation = false;
    screen_operation_display = false;
    movie_operation_display = false;
    editTheater = false;
    movieFormm: FormGroup;
    theaterForm: FormGroup;
    createTheaterForm = false;
    selected_theater_id: any;
    data: Date = new Date();
    focus;
    edit = false;
    editMovieId: any;
    focus1;
    selected_location: any;
    email: string;
    error: string;
    pass: string;
    movie_name: string;
    image_url: string;
    desc: string;
    release_date_value: any;
    booking_started: any;
    movieFormDisplay = false;
    theaters: [];
    dropdownOptions: any[] = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        // Add more options as needed
      ];
    movies: [];
    constructor(private formBuilder: FormBuilder, private messageService: MessageService, private auth: AuthenticationService, private router: Router, private http: HttpClient, public theaterSvc: TheaterService) {
        this.movieFormm = this.formBuilder.group({
            movie_name: ['', Validators.required],
            image_url: ['', Validators.required],
            desc: [''],
            release_date_value: [null, Validators.required],
            booking_started: [false]
        });
        this.theaterForm = this.formBuilder.group({
            theater_name: ['', Validators.required],
            location: ['']
        })
        this.http.get('/api/movies').subscribe((res: any) => {
            this.movies = res;
            console.log('constructor admin')
            console.log(res)
        })
        this.http.get('/api/theaters').subscribe((res: any) => {
            this.theaters = res;
        })
    }

    showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Movie Created' });
    }
    ngOnInit() {
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
    }
    ngOnDestroy() {
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    movieFormAddMovie() {
        this.movieFormDisplay = true;
        this.edit = false;
        this.movieFormm.reset();
    }
    theaterFormAddMovie() {
        this.createTheaterForm = true;
        this.theaterDiaplayForm = true;
        this.editTheater = false;
        this.theaterForm.reset();
    }
    movieForm() {
        this.movieFormDisplay = true;

    }

    saveMovie() {

    }
    EditMovie(id: any) {
        this.selected_movie_id=id;
        this.edit = true;
        this.http.get('/api/movies/' + id).subscribe((res: any) => {
            console.log(res);
            this.editMovieId = res.movie_id;
            const formattedDate = new Date(res.release_date); // Convert to JavaScript Date object
            const isoDate = formattedDate.toISOString().substring(0, 10); // Get YYYY-MM-DD format
            this.movieFormm.patchValue({
                movie_name: res.movie_name,
                image_url: res.image_url,
                release_date_value: isoDate,
                desc: res.description.description,
                booking_started: res.booking_started,
            })

            this.movieForm();


        })

    }
    backToMoviesList() {
        this.movieFormDisplay = false;
        this.createTheaterForm = false;
        this.http.get('/api/movies').subscribe((res: any) => {
            this.movies = res;
            console.log('constructor admin')
            console.log(res)
        })
    }

    backToTheaterList() {
        this.theaterDiaplayForm = false;
        this.http.get('/api/theaters').subscribe((res: any) => {
            this.theaters = res;
        })
    }
    DeleteMovie(id: any) {
        console.log(id)
        let params = new HttpParams();
        params = params.append('movie_id', id);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        this.http.delete('/api/movies', { params, headers }).subscribe((res) => {
            this.messageService.add({ severity: 'error', summary: 'Deleted', detail: 'Movie Deleted' });
            this.http.get('/api/movies').subscribe((res: any) => {
                this.movies = res;
                console.log('constructor admin')
                console.log(res)
            })
        })
    }
    CreateMovie() {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }

        console.log(this.movieFormm.value)
        if(this.edit){
            const body = {
                "movie_id":this.selected_movie_id,
                "movie_name": this.movieFormm.value.movie_name,
                "image_url": this.movieFormm.value.image_url,
                "release_date": this.movieFormm.value.release_date_value,
                "description": { "description": this.movieFormm.value.desc },
                "booking_started": this.movieFormm.value.booking_started
            }
            this.http.put('/api/movies', body, { headers }).subscribe((res) => {
                console.log(res);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Movie Edited' });

                this.movieFormm.reset();
    
            })
        }
        else{
            const body = {
                "movie_name": this.movieFormm.value.movie_name,
                "image_url": this.movieFormm.value.image_url,
                "release_date": this.movieFormm.value.release_date_value,
                "description": { "description": this.movieFormm.value.desc },
                "booking_started": this.movieFormm.value.booking_started
            }
            this.http.post('/api/movies', body, { headers }).subscribe((res) => {
                console.log(res);
                this.showSuccess();
                this.movieFormm.reset();
    
            })
        }
       

       
    }

    CreateTheater(){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        let body = {
            "theater_name": this.theaterForm.value.theater_name,
            "location_id":this.theaterForm.value.location.location_id,
            "movies":[]
        }

        console.log(this.theaterForm.value);
        this.http.post('/api/theaters',body,{headers}).subscribe((res)=>{
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Theater Created' });
            this.theaterForm.reset();
        })

    }
    screen_operations(id: any){
this.theaterOperation = true;
this.selected_theater_id = id;
    }

    remove_theater(id: any){
        console.log(id)
        let params = new HttpParams();
        params = params.append('theater_id', id);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        this.http.delete('/api/theaters', { params, headers }).subscribe((res) => {
            this.messageService.add({ severity: 'error', summary: 'Deleted', detail: 'Theater Deleted' });
            this.http.get('/api/theaters').subscribe((res: any) => {
                this.theaters = res;
            })
        })
    }

    assignTheater(id: any){
        this.selected_movie_id=id;
        console.log(id,this.selected_movie_id)
        this.assignTheaterOperation = true;
    }

}
