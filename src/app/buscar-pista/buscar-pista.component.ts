import { Component, OnInit, Injectable, OnChanges, SimpleChanges, Input, Directive, Renderer, ElementRef } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import {NgbTimeStruct, NgbTimeAdapter, NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { PeticionPartida } from '../Modelo/PeticionPartida';
import * as moment from 'moment';
import { PistasService } from '../Service/pistas.service';
import { HttpClient } from '@angular/common/http';
import { Pista } from '../Modelo/Pista';
import { Router } from '@angular/router';
import { ReservaService } from '../Service/reserva.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

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

@Directive({
  selector : '[buscar]'
})
export class BuscarPistaComponent implements OnInit {

  showLoading = false;

  peticionPartida = new PeticionPartida();
  listaPistas:Object
  pistaActual:[];
  errorBusqueda:String;

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


  constructor(private pistaService:PistasService, private router:Router, private reservaService:ReservaService, private renderer:Renderer, private elementRef:ElementRef ) { }

  ngOnInit() {
    this.dateControl = new FormControl('', [Validators.required]);

    let horaActual = moment(new Date()).format("HH")
    let hora = (parseInt(horaActual)+1) < 10 ? "0"+(parseInt(horaActual)+1):(parseInt(horaActual)+1);
    this.time = hora < "09" ? "09:00:00" : hora+":00:00";
    this.peticionPartida.horaInicio = this.time;
    this.peticionPartida.flexibilidad = 0;
    this.duracion = "90";
    this.controlHora();

    this.renderer.listen(this.elementRef.nativeElement, 'click', (evt) => {
      console.log(evt.target)
      if(evt.target.classList.contains("ngb-tp-chevron") || evt.target.classList.contains("bottom") || evt.target.classList.contains("ng-star-inserted")){
        this.cambioHora();
      }
    });

  }



  public controlHora(){
    let partesFecha;
    if(moment(new Date()).isBefore(this.fecha["_d"])){
      this.time = "09:00:00";
      partesFecha = moment(new Date()).toString().split(" ");
      partesFecha[4] =  "09:00:00";
    } else {
      let horaActual = moment(new Date()).format("HH")
      let hora = (parseInt(horaActual)+1) < 10 ? "0"+(parseInt(horaActual)+1):(parseInt(horaActual)+1);
      this.time = hora+":00:00";
      partesFecha = moment(new Date()).toString().split(" ");
      partesFecha[4] =  hora+":00:00";
    }
       this.minDate = new Date(partesFecha.join(" "));
  }

  /**
   * Al realizar cambios en la selección de hora
   */
  public cambioHora(){
    let hora = parseInt(this.time.split(":")[0]);
    //Hora actual +1
    let minHora = parseInt(moment(this.minDate).format("HH"));

    if( hora <  minHora || hora > 22){
      this.time = minHora+":00:00";
    }

  }  

  buscarPartida(){
    this.showLoading = true;
    let fechaString = moment(this.fecha).format("DD/MM/YYYY");
    
    this.peticionPartida.horaInicio =  fechaString + " "+ this.time;
    this.peticionPartida.duracion = parseInt(this.duracion);
    this.peticionPartida.flexibilidad = this.flexibilidad;

    return this.pistaService.buscarPartida(this.peticionPartida).
    subscribe(data => {
      if(data.success != undefined){
        this.errorBusqueda = data.message;
        this.listaPistas = undefined;
      } else {
        this.errorBusqueda = undefined;
        this.listaPistas = this.organizarPistas(data);
        sessionStorage.setItem("dispoPistas", JSON.stringify(data));
      }
      this.showLoading = false;
    },
    error => {
      this.errorBusqueda = error.error;
    }
    )
  
  }

  /**
   * Organizamos las pistas que no llegan por:
   *  - Club
   *  - Hora inicio
   * @param pistas 
   */
  organizarPistas(pistas:any):any {    
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
        let hora = p.horaInicio.toString().split(" ")[3].slice(0,5);
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
          sessionStorage.setItem("reservaSeleccionada", JSON.stringify(pista));
          this.router.navigateByUrl("reservar");
      }
  }

  public nombreClaseClub(club):string{
    return club.replace(/\s/g,"").toLowerCase();
  }

}
