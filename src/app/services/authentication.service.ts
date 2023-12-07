import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user: any;
  loggedin :boolean =false;
  constructor(private http: HttpClient) { 
    
  }

  login(email: string, password: string){
    let body = {email,password}
    return this.http.post('/api/user/login',body)
  }

  singup(email: string, password: string, username: string){
    let body = {email, password, username};
    return this.http.post('/api/user/signup',body)
  }

  logout(){
    this.user={};
    this.loggedin=false;
  }
}
