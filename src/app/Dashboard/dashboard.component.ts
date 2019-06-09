import { Component, OnInit } from '@angular/core';
import {JwtResponse} from '../Modelo/JwtResponse';
import {UsuarioService} from '../Service/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../Modelo/Usuario';
import { ClubService } from '../Service/club.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(
    private usuarioService:UsuarioService, 
    private router:Router,
    private clubService:ClubService) { }

  private usuario:JwtResponse;
  private esClub = false;
  private esUsuario = false;
  nombreClub:string;

  ngOnInit() {
      let token = sessionStorage.getItem("token");
    
      if(token == undefined){
        this.router.navigateByUrl("/login");
      } else {
         this.usuarioService.permisos(token).subscribe(item => {
            //redirigir a usuario según su rol
            let usr = JSON.parse(item["jwtUser"]);
            this.redirigirUsuario(usr);
            this.obtenerClub(usr.idClub)
        }); 
      }
    
  }

  
  redirigirUsuario(usr:JwtResponse):void{
    this.usuario = usr;
    if(usr["role"] == "club"){
      this.esClub = true;
      this.esUsuario = false;
    } else {
      this.esClub = false;
      this.esUsuario = true;
    }
  }

  logout(){
    sessionStorage.clear();
    location.reload();
  }

  obtenerClub(idClub){
    this.clubService.nombreClub(idClub).subscribe(item => {
      this.nombreClub = item;
  }); 
  }

}
