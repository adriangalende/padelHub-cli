import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { Usuario } from '../../Modelo/Usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.sass']
})
export class RegistroComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  private usuario : Usuario;
  ngOnInit() {
  }

  onRegister(form):void{
    this.authService.register(form.value).subscribe(data => {
      let alert = document.getElementsByClassName('alert-registro')[0];
      alert.classList.add("hidden");
      if(data.success){
        this.router.navigateByUrl("login");
      } else {
       alert.textContent = data.message;
       alert.classList.add("alert-warning");
       alert.classList.remove("hidden");
      }
    })
    
  }

}
