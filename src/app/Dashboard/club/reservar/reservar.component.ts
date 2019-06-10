import { Component, OnInit, Inject, Injectable, Renderer, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormControl } from '@angular/forms';
import { ReservaService } from 'src/app/Service/reserva.service';;
import { Pista } from 'src/app/Modelo/Pista';


export interface DialogData {
  pistas: any;
  idClub: number;
}

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
  selector: 'app-reservar',
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.sass'],
  providers:[{
    provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter
  }]
})
export class ReservarComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReservarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private reservaService:ReservaService,
    private renderer:Renderer,
    private elementRef:ElementRef
  ) { }

  minDate = new Date();
  fecha = new Date();

  pistaSeleccionada;

  public time:string;
  step=30;
  size="large";

  
  duracion;
  dateControl;

  bloqueo;

  idClub:number;
  reserva:Pista;
  tiposReserva:any;
  clubTieneBloqueo:boolean;
  idBloqueo:number;
  descripcion:string;
  telefono:string;
  showLoading = false;

  errorBusqueda:string;

  ngOnInit() {
    this.dateControl = new FormControl('', [Validators.required]);
    let horaActual = this.moment(new Date()).format("HH")
    let hora = (parseInt(horaActual)+1) < 10 ? "0"+(parseInt(horaActual)+1):(parseInt(horaActual)+1);
    this.time = hora+":00:00";
    this.duracion = "90";
    this.idClub = this.data.idClub;
    this.controlHora()

    //Obtenemos los tipos de reserva para ver si el club tiene bloqueo de pista
    this.obtenerTiposReserva(this.idClub);

    this.renderer.listen(this.elementRef.nativeElement, 'click', (evt) => {
      if(evt.target.classList.contains("ngb-tp-chevron") || evt.target.classList.contains("bottom") || evt.target.classList.contains("ng-star-inserted")){
        this.cambioHora();
      }
    });
  }

  public controlHora(){
    let partesFecha;
    if(this.moment(new Date()).isBefore(this.fecha["_d"])){
      this.time = "09:00:00";
      partesFecha = this.moment(new Date()).toString().split(" ");
      partesFecha[4] =  "09:00:00";
    } else {
      let horaActual = this.moment(new Date()).format("HH")
      let hora = (parseInt(horaActual)+1) < 10 ? "0"+(parseInt(horaActual)+1):(parseInt(horaActual)+1);
      this.time = hora+":00:00";
      partesFecha = this.moment(new Date()).toString().split(" ");
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
    let minHora = parseInt(this.moment(this.minDate).format("HH"));

    if( hora <  minHora || hora > 22){
      this.time = minHora+":00:00";
    }

  }  
  private adaptarFechaHora(fecha, hora):string{
    let fechaAux = fecha.toString();
    let partesFecha = fechaAux.split(" ");
    //El formato de fechas es siempre el mismo, y en el array debería ocupar el índice 4
    // Fri Jun 07 2019 18:56:47 GMT+0200 (hora de verano de Europa central)
    partesFecha[4] = hora;
    
    return partesFecha.join(" ");
  }

  moment = require('moment');
  reservar(idClub){
      let puedeReservar = false;

      if(typeof this.time == "object"){
          this.time = new NgbTimeStringAdapter().toModel(this.time);
      }
      this.reserva = {};
      this.reserva.idPista = this.pistaSeleccionada;
      this.reserva.duracion = this.duracion;
      this.reserva.idClub = this.data.idClub;
      this.reserva.horaInicio = this.moment(this.adaptarFechaHora(this.fecha, this.time)).format("DD/MM/YYYY HH:mm:ss");
      if(this.bloqueo){
        this.reserva.id_tipo_reserva = this.idBloqueo;
      }

      if(this.descripcion == undefined || this.descripcion == "" || ((this.telefono == undefined || this.telefono == "") && !this.bloqueo) || this.pistaSeleccionada == undefined){
        this.errorBusqueda = "Es necesario rellenar el motivo de la reserva";
      } else {
        puedeReservar = true;
        if(this.telefono == undefined){
          this.telefono = "";
        }
        this.reserva.descripcion = this.descripcion +"#@"+this.telefono;
      }

      if(puedeReservar){
        return this.reservaService.reservar(this.reserva).
        subscribe(data => { 
          if(data.success != undefined){
            this.errorBusqueda = data.message;
          } else {
            location.reload();
          }
        },
        error => {
          this.errorBusqueda = error.error;
        }
        )
      } else {
        this.errorBusqueda = "No se ha podido realizar la reserva, Revisa los campos del formulario";
      }
  }

  private obtenerTiposReserva(idClub){

    return this.reservaService.obtenerTiposReservaClub(idClub).
      subscribe(data => { 
        if(data["success"]){

        } else { // Entra con tipos de reserva
            this.tiposReserva = data;
            //El club tiene bloqueo como tipo de reserva?
             this.clubTieneBloqueo = this.clubPuedeBloquear();
        }
      },
      error => {
      }
      )
  }


  //Si el club tiene tipos de reserva, y una de ellas es bloqueo => true
  private clubPuedeBloquear():boolean{
    let flag = false;
    if(this.tiposReserva != undefined){
      this.tiposReserva.forEach(tipoReserva => {
        if(tipoReserva.descripcion == "bloqueo"){
           flag = true;
           this.idBloqueo = tipoReserva.id;
        }
      });
    }
    return flag;
  }

}
