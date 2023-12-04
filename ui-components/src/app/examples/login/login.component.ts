import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

    data : Date = new Date();
    focus;
    focus1;
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

    login(){
        this.error='';
        this.auth.login(this.email,this.pass).subscribe((res:any)=>{
            console.log(res);
            this.auth.loggedin=true;
            this.auth.user=res;
            this.router.navigate(['/']);
        },
        (error: any)=>{
            console.log(error)
                this.error="Incorrect Credentials"
        })
    }

}
