import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { TheaterService } from '../../services/theater.service';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss'],
    providers: [MessageService]

})
export class discountComponent {
    myForm: FormGroup;
    checkedTuesday = false;
    evening = false;
    val1;
  constructor(private messageService: MessageService ,private http: HttpClient, private auth: AuthenticationService) {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json' // Set default header
    });
    if (this.auth.user?.token) {
        headers = headers.set('Authorization', this.auth.user.token);
    }
        
    this.http.get('/api/ticket/discount',{headers}).subscribe((res:any)=>{
        this.checkedTuesday = res.discount.tuesday;
        this.evening = res.discount.sizPM;
        this.val1 = res.percentage;
    })
  }
    
  Update(){
        let body ={
            "percentage":this.val1,
            "discount":{
                "tuesday":this.checkedTuesday,
                "sixPM": this.evening
            }
        }
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' // Set default header
        });
        if (this.auth.user?.token) {
            headers = headers.set('Authorization', this.auth.user.token);
        }
        this.http.post('/api/ticket/discount',body,{headers}).subscribe((res)=>{
            console.log(res);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Discount Configuration Updated' });
        })
  }
}
