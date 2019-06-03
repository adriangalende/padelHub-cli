import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../Service/reserva.service';
import { Router } from '@angular/router';
import { Pista } from '../Modelo/Pista';
import { componentFactoryName } from '@angular/compiler';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { _localeFactory } from '@angular/core/src/application_module';


@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.sass']
})

export class ReservaComponent implements OnInit {

  constructor(private reservaService:ReservaService, private router:Router) { }

 reserva:Pista;
 listaPistas:any;

  ngOnInit() {
    if(sessionStorage.getItem("reservaSeleccionada") != undefined){
        this.reserva = JSON.parse(sessionStorage.getItem("reservaSeleccionada"));
    } else {
        this.router.navigateByUrl("/buscar");
    }

    if(sessionStorage.getItem("dispoPistas") != undefined){
        this.listaPistas = JSON.parse(sessionStorage.getItem("dispoPistas"));
        this.completarDatosReserva();
    }

  }

  mensajeError:String;
  bloqueaReserva:boolean;
  alert:Alert;
  
  private SHORTMONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  private moment = require("moment");

  private parsearFecha(fecha:String):Date{
      let arrayFecha = fecha.split(" ");
      let mes:any;
      mes = this.SHORTMONTH.indexOf(arrayFecha[1]) +1;
      mes = mes < 10 ? "0"+mes : mes;
      let fechaFormateada = arrayFecha[5] + "-" + mes + "-" +  arrayFecha[2] + " " + arrayFecha[3];

      return new Date(fechaFormateada);
  }


  reservar(pista:Pista){
    let dateFormat = this.parsearFecha(pista.horaInicio.toString());
    pista.horaInicio = this.moment(this.parsearFecha(pista.horaInicio.toString())).format("DD/MM/YYYY HH:mm:ss");

    return this.reservaService.reservar(pista).
    subscribe(data => {

      this.alert = {
        type: "success",
        message: "Parece que tu reserva se ha realizado !"
      };
      this.mensajeError = undefined;
      setTimeout(()=>{   
        this.router.navigateByUrl("/dashboard");  
       }, 3000)
            
      
    },
    error => {
      this.mensajeError = error.error.text;
      this.bloqueaReserva = true;
    }
    )
  }

  buscar():void{
    this.router.navigateByUrl("/buscar");
  }

  completarDatosReserva():void{

    //filtramos las pistas para obtener los datos
    let listaAuxiliar = this.listaPistas.filter(pista => {
      return pista.idPista == this.reserva.idPista;
    });

    //Ponemos los datos genéricos aquí
    let pista = listaAuxiliar[0];
    
    this.reserva.nombre = pista.nombre;
    this.reserva.club = pista.club;
    this.reserva.idClub = pista.idClub;

    if(listaAuxiliar.length == 1){
      this.reserva.horaInicio = pista.horaInicio;
      this.reserva.precio = pista.precio;
    } else {
      listaAuxiliar.forEach(pista => {
        if(pista.precio == this.reserva.precio){
          this.reserva.horaInicio = pista.horaInicio;
        }
      })
    }
  }

}
