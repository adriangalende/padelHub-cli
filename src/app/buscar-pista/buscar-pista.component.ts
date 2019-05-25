import { Component, OnInit, Injectable, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import {NgbTimeStruct, NgbTimeAdapter, NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { PeticionPartida } from '../Modelo/PeticionPartida';
import * as moment from 'moment';
import { PistasService } from '../Service/pistas.service';
import { HttpClient } from '@angular/common/http';
import { Pista } from '../Modelo/Pista';
import { Router } from '@angular/router';

@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

  fromModel(value: string): NgbTimeStruct {
    if (!value) {
      return null;
    }
    const split = value.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split[2], 10)
    };
  }
  
  toModel(time: NgbTimeStruct): string {
    if (!time) {
      return null;
    }

    return `${this.padHour(time.hour)}:${this.pad(time.minute)}:${this.pad(time.second)}`;
  }

  private padHour(i: number): string {

    return i < 10 ? `0${i}` : `${i}`;
  }

  private pad(i: number): string {
    return i < 10 ? `0${i}` : `${i}`;
  }
}


@Component({
  selector: 'app-buscar-pista',
  templateUrl: './buscar-pista.component.html',
  styleUrls: ['./buscar-pista.component.sass'],
  providers:[{
    provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter
  }]
})
export class BuscarPistaComponent implements OnInit {
  
  peticionPartida = new PeticionPartida();
  listaPistas:Object
  pistaActual:[];

  // Datepicker config
  minDate = new Date();
  fecha = new Date();

  flexibilidad:number;

  // Timepicker config
  public time:string;
  step=30;
  size="large";
  
  duracion:string;

  timeModel = new NgbTimeStringAdapter();
  timeAux:NgbTimeStruct;

  dateControl:FormControl;

  constructor(private pistaService:PistasService, private router:Router) { }

  ngOnInit() {
    this.dateControl = new FormControl('', [Validators.required]);
    this.timeAux = this.timeModel.fromModel("09:00:00");
    this.time = this.timeModel.toModel(this.timeAux);
    this.peticionPartida.horaInicio = this.time;
    this.peticionPartida.flexibilidad = 0;
    this.duracion = "90";
  }

  /**
   * Al realizar cambios en la selección de hora
   */
  cambioHora(){
    let hora = parseInt(this.time.split(":")[0]);
    let horaMenos = document.querySelectorAll(".ngb-tp-hour button")[1];
    let horaMas = document.querySelectorAll(".ngb-tp-hour button")[0];
    let minutoMenos = document.querySelectorAll(".ngb-tp-minute button")[1];
    let minutoMas = document.querySelectorAll(".ngb-tp-minute button")[1];

    if( hora <=  9 || hora >= 22){
      if(hora <= 9){
        horaMenos.classList.add("disabled");
        horaMenos.setAttribute("disabled","disabled");
      } else {
        horaMas.classList.add("disabled");
        horaMas.setAttribute("disabled","disabled");
      }
      this.time = "09:00:00";
      console.log(this.time)
    } else {
      horaMenos.classList.remove("disabled");
      horaMenos.removeAttribute("disabled");
      horaMas.classList.remove("disabled");
      horaMas.removeAttribute("disabled");
    }
  }  

  buscarPartida(){
    let fechaString = moment(this.fecha).format("DD/MM/YYYY");
    this.peticionPartida.horaInicio =  fechaString + " "+ this.time;
    this.peticionPartida.duracion = parseInt(this.duracion);
    this.peticionPartida.flexibilidad = this.flexibilidad;

    return this.pistaService.buscarPartida(this.peticionPartida).
    subscribe(data => {
      this.listaPistas = this.organizarPistas(data);
      sessionStorage.setItem("dispoPistas", JSON.stringify(this.listaPistas));
      console.log(this.listaPistas)
    },
    error => console.log(error)
    )
  
  }

  /**
   * Organizamos las pistas que no llegan por:
   *  - Club
   *  - Hora inicio
   * @param pistas 
   */
  organizarPistas(pistas:any):any {
    console.log("Entramos a organizar pistas")
    console.log(pistas);
    
    //Primero obtenemos los clubes
    this.listaPistas = this.obtenerNombreClubes(pistas);
    
    //ordenamos por bloques de horas
    this.listaPistas = this.ordenarPorHora(pistas, this.listaPistas);

    return this.listaPistas;
  }


  obtenerNombreClubes(pistas:any):any{
    let clubes = {};

    pistas.forEach(pista => {
        let p:Pista;
        p = pista;
        if(clubes[""+p.club+""] == undefined){
          clubes[""+p.club+""] = {};
        }
    });

    return clubes;
  }

  ordenarPorHora(pistas:any, listaPistas:any):any{
    let clubes = listaPistas;

      pistas.forEach(pista => {
        let p:Pista = pista;
        let nombreClub = p.club;
        let hora = moment(p.horaInicio).format("HH:mm");
        if( clubes[""+p.club+""][""+hora+""] == undefined){
          clubes[""+p.club+""][""+hora+""] = {};
        }

        if(clubes[""+p.club+""][hora][""+p.nombre+""] == undefined){
          clubes[""+p.club+""][hora][""+p.nombre+""] = {
            idPista:p.idPista,
            duracion:p.duracion,
            precio:p.precio,
            precioLuz:p.precioLuz,
            rutaImagenes:p.rutaImagenes,
            tipoPista:p.tipoPista
          }
        }

    });

    return clubes;
  }

  obtenerClubes(listaPistas:any){
    return Object.keys(listaPistas);
  }

  obtenerHoras(club:String){
    return Object.keys(this.listaPistas[""+club])
  }

  obtenerPistas(club:String, hora:String){
    return Object.keys(this.listaPistas[""+club][hora])
  }

  obtenerPistaActual(club,hora,pista){
    return this.listaPistas[club][hora][pista];
  }


  reservar(pista:Pista){
      if(sessionStorage.getItem("token") == undefined){
         this.router.navigateByUrl("/login")
      } else {
        console.log("OJOOO QUE RESERVAS!");
        console.log(pista);
      }
  }

}
