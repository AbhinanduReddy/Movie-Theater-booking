import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { TheaterService } from '../../services/theater.service';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-theaterOperation',
    templateUrl: './theaterOperation.component.html',
    styleUrls: ['./theaterOperation.component.scss'],
    providers: [MessageService]

})
export class theaterOperationComponent implements OnInit {
    @Input() id: any;
    @Input() screen: boolean;
    newcreenForm: FormGroup;
    ss: any;
    sss:any;
    editscreenform: FormGroup;
    removeshowtime: FormGroup;
    selected_screen_id: any;
    checked = false;
    screens: [];
    selected_theater: any;
    blocked_show_times=[];
;    constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthenticationService, private messageService: MessageService) {
        this.newcreenForm = this.fb.group({
            screen_name: [''],
            rows: [''],
            columns: [''],
            showTimes: this.fb.array([])
        });

        this.editscreenform = this.fb.group({
            screen_name: [''],
            rows: [''],
            columns: [''],
            deleteShows: [[]],
            showTimes: this.fb.array([])
        });
        this.removeshowtime = this.fb.group({
            screen_name: [''],
            blocked_show_times_form: [[]]
        })

        this.addTimeInput();
    }

    ngOnInit(): void {

    }

    addTimeInput() {
        const timeControl = this.fb.control('');
        (this.newcreenForm.get('showTimes') as FormArray).push(timeControl);
    }
    addEditTimeInput(){
        const timeControl = this.fb.control('');
        (this.editscreenform.get('showTimes') as FormArray).push(timeControl)
    }
    newScreen() {
        console.log(this.newcreenForm.value);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        let body = {
            "show_times": this.newcreenForm.value.showTimes,
            "columns": this.newcreenForm.value.columns,
            "rows": this.newcreenForm.value.rows,
            "screen_name": this.newcreenForm.value.screen_name,
            "theater_id": this.id
        }
        this.http.post('/api/theaters/theater_screen', body, { headers }).subscribe((res) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Screen Created' });
            this.newcreenForm.reset();
        })

    }


    handleChange($event) {
        console.log($event);
        console.log(this.editscreenform.controls.showTimes)

        const showTimesArray = this.editscreenform.get('showTimes') as FormArray;
        showTimesArray.clear(); 
        this.editscreenform.reset();
        if ($event.index >=1) {
            let params = new HttpParams();
            params = params.append('theater_id', this.id);
            this.http.get('/api/theaters/theater_screen', { params }).subscribe((res: any) => {
                this.screens = res;
            })
        }
    }
    populateScreen($event){
        const showTimesArray = this.editscreenform.get('showTimes') as FormArray;
        showTimesArray.clear(); 
        this.editscreenform.reset();
        console.log($event);
        this.selected_screen_id=$event.value.screen_id;
        this.editscreenform.patchValue({
            screen_name:$event.value.screen_name,
            rows:$event.value.rows,
            columns:$event.value.columns,
        })

        if ($event.value.show_times) {
            const showTimesArray = this.editscreenform.get('showTimes') as FormArray;
            $event.value.show_times.forEach((time: any) => {
              showTimesArray.push(this.fb.control(new Date(time)));
            });
          }
    }
    removeTimeInput(index: number) {
        (this.editscreenform.get('showTimes') as FormArray).removeAt(index);
      }

      editScreen(){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        let body = {
            "show_times": this.editscreenform.value.showTimes,
            "columns": this.editscreenform.value.columns,
            "rows": this.editscreenform.value.rows,
            "screen_name": this.editscreenform.value.screen_name,
            "screen_id": this.selected_screen_id
        }

        this.http.put('/api/theaters/theater_screen',body,{headers}).subscribe((res)=>{
            this.editscreenform.controls.showTimes.reset();
            const showTimesArray = this.editscreenform.get('showTimes') as FormArray;
            showTimesArray.clear(); 
            this.editscreenform.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Screen Edited' });

        })
    
    }

    getBlockedShowTimes($event){
        this.sss = $event.value;
        let params = new HttpParams();
        params = params.append('theater_id', this.id);
        params = params.append('screen_id', $event.value.screen_id);

        this.http.get('/api/theaters/screen', { params }).subscribe((res: any[]) => {
            console.log(res);
            this.blocked_show_times=[];
            res.forEach((r:any)=>{
            
                this.blocked_show_times.push(r?.show_time);

            })
            
            
           
        })
    }
    formatTimeDisplay(time: string): string {
        const date = new Date(time);
        const formattedTime = date.toLocaleTimeString(); // Adjust formatting options as needed
        return formattedTime;
    }

    removeShows(){
        console.log(this.removeshowtime.value);
        let st=[];
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        this.blocked_show_times.forEach((res)=>{
            const c= this.formatTimeDisplay(res);
            if(this.removeshowtime.value.blocked_show_times_form.includes(c)){
                st.push(res);
            }
        })
        let body ={
            "screen_id":this.removeshowtime.value.screen_name.screen_id,
            "show_times":st
        }
        this.http.delete('/api/theaters/screen',{headers,body}).subscribe((res)=>{
            this.removeshowtime.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Screen Show times Freed' });

        })
    }
}
