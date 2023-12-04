import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent  {

    data : Date = new Date();
    focus;
    focus1;
    username: string;
    email: string;
    error: string;
    pass: string;
    constructor(private auth:AuthenticationService, private router: Router) { }

     ngOnInit() {
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
    }
     ngOnDestroy(){
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    signup(){
        this.error='';
        this.auth.singup(this.email,this.pass,this.username).subscribe((res:any)=>{
            this.router.navigate(['/login']);
        },
        (error: any)=>{
            console.log(error)
                this.error="Error in Registering User"
        })
    }
}
