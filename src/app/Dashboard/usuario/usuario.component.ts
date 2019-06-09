import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import { UsuarioService } from 'src/app/Service/usuario.service';
import { ReservaService } from 'src/app/Service/reserva.service';
import { Router } from '@angular/router';
import { Pista } from 'src/app/Modelo/Pista';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.sass']
})
export class UsuarioComponent implements OnInit {

  constructor(
    private usuarioService:UsuarioService, 
    private reservaService:ReservaService, 
    private router:Router,
    private _snackBar: MatSnackBar,
    private renderer:Renderer,
    private elementRef:ElementRef
    ) { }

  listaReservas:Pista
  proximasReservas:number;

  ngOnInit() {
    this.cargarReservas();
  }

  buscar(){
    this.router.navigateByUrl("/buscar");
  }

  mensaje:String;
  private cargarReservas(){
      this.reservaService.recuperarReservas().subscribe(data => {
        if(data.success == undefined){
          this.listaReservas = data;
          this.proximasReservas = data.length;
        } else {
          this.mensaje = data.message;
        }
    });
    
  }

  alert:Alert
  cancelar(event, peticion:Pista){
  
    return this.reservaService.cancelar(peticion).
    subscribe(data => {
        this._snackBar.open(data.message,"",{
          duration: 2000,
        });
        event.srcElement.offsetParent.offsetParent.classList.add("hidden");
      },
      error => {
        this._snackBar.open(error.error.text,"",{
          duration: 2000,
        });
      }
    )
  }
}
