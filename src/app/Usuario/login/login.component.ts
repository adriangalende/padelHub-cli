import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/auth.service';
import { Usuario } from 'src/app/Modelo/Usuario';
import { $ } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router:Router) { }
  private usuario: Usuario = {
    email:"",
    password:""
  }

  private token:string;
  
  onLogin(){
    return this.authService.loginUser(this.usuario.email, this.usuario.password).
    subscribe(data => {
      let alert = document.getElementsByClassName('alert-login')[0];
      alert.classList.add("hidden");
      if(data.success){
        sessionStorage.setItem("token",data.token);
        this.token = data.token;
        this.router.navigateByUrl('/dashboard');
      } else {
       alert.textContent = data.message;
       alert.classList.add("alert-warning");
       alert.classList.remove("hidden");
      }
    },
    error => {
      let alert = document.getElementsByClassName('alert-login')[0];
      alert.textContent = "Houston, hemos tenido un problema..";
      alert.classList.add("alert-danger");
      alert.classList.remove("hidden");
    }
    )
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl("/home");
  }

  ngOnInit() {
    this.token = undefined;
    if(sessionStorage.getItem("token") != undefined){
        this.token = sessionStorage.getItem("token");
    }
  }

  getToken():string{
    return this.token;
  }

}
