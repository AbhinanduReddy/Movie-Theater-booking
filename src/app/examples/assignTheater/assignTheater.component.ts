import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { TheaterService } from '../../services/theater.service';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-assignTheater',
    templateUrl: './assignTheater.component.html',
    styleUrls: ['./assignTheater.component.scss'],
    providers: [MessageService]

})
export class assignTheaterComponent {
    @Input() id: any;
    theaters: [];
    theater: any;
    location: any;
    screens: [];
    cost: any;
    screen: any;
    show_times: [];
    available_show_times: [];
    assigntheaterForm: FormGroup;
    

    constructor(private formBuilder: FormBuilder, public theaterSvc: TheaterService, private http: HttpClient, private auth: AuthenticationService, private messageService: MessageService) {
        this.assigntheaterForm = this.formBuilder.group({
            theater_name: ['', Validators.required],
            location: ['', Validators.required],
            screen_name: ['', Validators.required],
            show_times: [[]],
            cost: ''
        });

        console.log(this.id)
    }

    locationSelected($event) {
        this.location = $event.value;
        console.log($event)
        this.http.get('/api/theaters/location/' + $event.value.location_id).subscribe((res: any) => {
            this.theaters = res;
        })
    }

    theaterSelected($event) {
        console.log(this.theater);
        console.log($event);
        this.theater = $event.value;
        let params = new HttpParams();
        params = params.append('theater_id', $event.value.theater_id);
        this.http.get('/api/theaters/theater_screen', { params }).subscribe((res: any) => {
            this.screens = res;
        })
    }


    screenSelected($event) {
        this.screen = $event.value;
        let params = new HttpParams();
        params = params.append('theater_id', this.theater.theater_id);
        params = params.append('screen_id', this.screen.screen_id);

        this.http.get('/api/theaters/screen', { params }).subscribe((res: any) => {
            console.log(res);
            let show_times_assigned =  [];
            res.forEach((val)=>{
        
                    show_times_assigned.push(val.show_time);
             
            })
            console.log(show_times_assigned);
            console.log(this.screen.show_times);
            this.available_show_times = this.screen.show_times.filter(time => !show_times_assigned.includes(time));
        })
    }

    formatTimeDisplay(time: string): string {
        const date = new Date(time);
        const formattedTime = date.toLocaleTimeString(); // Adjust formatting options as needed
        return formattedTime;
    }

    assignTheater() {
        console.log(this.assigntheaterForm.value);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        let st=[];
        this.available_show_times.forEach((res)=>{
            const c= this.formatTimeDisplay(res);
            if(this.assigntheaterForm.value.show_times.includes(c)){
                st.push(res);
            }
        })
        let body =
        {
            "theater_id": this.theater.theater_id,
            "movie_id": this.id,
            "screen_id": this.screen.screen_id,
            "screen_name": this.screen.screen_name,
            "show_times": st,
            "cost": this.assigntheaterForm.value.cost
        }
        this.http.post('/api/theaters/screen', body, { headers }).subscribe((res) => {
            console.log(res);
            this.assigntheaterForm.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Movie Created' });

        })



    }
}
