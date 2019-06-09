import { Component, OnInit, NgModule, ViewChild, enableProdMode, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaService } from 'src/app/Service/reserva.service';
import { Pista } from 'src/app/Modelo/Pista';
import * as moment from "moment";
import { PistasService } from 'src/app/Service/pistas.service';
import { MatDialog } from '@angular/material/dialog';
import { ReservarComponent } from './reservar/reservar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiposReserva } from 'src/app/Modelo/TiposReserva';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.sass']
})
export class ClubComponent implements OnInit {

  
  currentDate: Date = new Date();
  mensaje:String;
  listaReservas:Pista
  listaTodasReservas: Pista;
  tiposReserva:any;
  idBloqueo:number;
  numeroPistas:number;
  listaPistas:Pista[];
  reservasDia:any;
  showLoading = true;

  constructor(
    private reservaService:ReservaService, 
    private pistaService:PistasService, 
    private router:Router, 
    public dialog:MatDialog,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.cargarReservas();
  }



  private obtenerDatosPistasClub(idClub){
    this.pistaService.pistasClub(idClub).subscribe(data => {
        this.listaPistas = data; 
    }); 
  }

  private obtenerTiposReservaClub(idClub){
    this.reservaService.obtenerTiposReservaClub(idClub).subscribe(data => {
        this.tiposReserva = data; 
        this.tiposReserva.forEach(tipoReserva => {
          if(tipoReserva.descripcion == "bloqueo"){
            this.idBloqueo = tipoReserva.id;
            this.showLoading = false;
          }
        })
    }); 
  }

  private cargarReservas(){
      this.reservaService.recuperarReservasClub().subscribe(data => {

        if(data.success == undefined){
          this.listaReservas = data;
        } else {
          this.mensaje = data.message;
        }
        this.showLoading = false;
    });

    this.reservaService.recuperarTodasReservasClub().subscribe(data => {
      if(data.success == undefined){
        this.listaTodasReservas = this.ordenarReservas(data);
        sessionStorage.setItem("listaReservas",JSON.stringify(this.listaTodasReservas));
        this.obtenerDatosPistasClub(<Pista> data[0].idClub);
        this.obtenerTiposReservaClub(data[0].idClub);
      } else {
        this.mensaje = data.message;
      }
      this.showLoading = false;
  }); 


  }

  
 

  private ordenarReservas(reservas):any{
    let reservasOrdenadas:any
    //primero ordenamos todas las reservas por fecha (horaInicio)
    reservasOrdenadas = this.ordenarPorFecha(reservas);
   
    //Ordenamos por nombre de pistas.
    reservasOrdenadas = this.ordenarPorPista(reservas, reservasOrdenadas);

    return reservasOrdenadas;
  }

  private parsearFecha(fecha:String):Date{
    let soloFecha = fecha.split(" ")[0];
    let dia = parseInt(soloFecha.split("/")[0]);
    //El mes esta en array ( empieza en 0 )
    let mes = parseInt(soloFecha.split("/")[1])-1;
    let ano = parseInt(soloFecha.split("/")[2]);

    return new Date(ano, mes, dia)
  }

  private ordenarPorFecha(reservas):any{
      let fechas = {}
      reservas.forEach(reserva => {
        let fechaReserva = moment(this.parsearFecha(reserva.horaInicio)).format("DD/MM/YYYY");
        if(fechas[fechaReserva] == undefined){
            fechas[fechaReserva] = {}
        }
      });

      return fechas;
  }

  private ordenarPorPista(reservas, fechas):any {
      reservas.forEach(reserva => {
        //Si la fecha de la reserva coincide con la key del objeto fechas
        let fecha = reserva.horaInicio.split(" ")[0];
        if(Object.keys(fechas).includes(fecha)){
          if(fechas[fecha][reserva.nombrePista] == undefined){
            fechas[fecha][reserva.nombrePista] = [];
          }
          fechas[fecha][reserva.nombrePista].push(reserva);
        }
      })
      return fechas;
  }

  cambiarDia(masMenos){
    let momentum = moment(this.currentDate)
    if(masMenos == 1){
        momentum.add(1,'days');
    } else if ( masMenos == 0){
      momentum.subtract(1,'days');
    }
    this.currentDate = momentum.toDate();
    this.reservasDia = this.listaTodasReservas[momentum.format("DD/MM/YYYY")];
  }

  cambiarDiaHoy(){
    this.currentDate = new Date();
  }

  esHoy(currentDate):boolean{
      if(moment(new Date()).isBefore(currentDate) || moment(new Date()).isAfter(currentDate)){
        return false;
      }
      return true;
  }

  openDialog():void{
    const dialogRef = this.dialog.open(ReservarComponent, {
      width: '350px',
      data: {
        pistas: this.listaPistas,
        idClub: this.listaPistas[0].idClub
      }
    });
  }

  /**
   * Obtenemos los datos del usuarios que ha realizado la reserva por vía telefónica
   * @param descripcion 
   * @param campo 
   */
  public datosUsuarioLlamada(descripcion, campo):string{
    if(descripcion != undefined && descripcion != null){
      let partesDescripcion = descripcion.split("#@")
      if(partesDescripcion.length >= 1 && campo == "nombre"){
         return partesDescripcion[0];
      } else if (partesDescripcion.length == 2 && campo == "telefono"){
        return partesDescripcion[1];
      } else{
        //no hacemos nada porque al final ya devolvemos null;
      }
    }
      return null
  }

  //Los usuarios se han presentado a la partida y han abonado el dinero
  checkIn(reserva:Pista){
    return this.reservaService.checkIn(reserva).
    subscribe(data => {
        this._snackBar.open(data.message,"",{
          duration: 2000,
        });
        reserva.checkIn = 1;
        location.reload();
      },
      error => {
        this._snackBar.open(error.error.text,"",{
          duration: 2000,
        });
      }
    )
  }

    //Los usuarios no se han presentado o la pista no ha sido pagada.
    noShow(reserva:Pista){
      return this.reservaService.noShow(reserva).
      subscribe(data => {
          this._snackBar.open(data.message,"",{
            duration: 2000,
          });
          reserva.checkIn = 1;
          location.reload();
        },
        error => {
          this._snackBar.open(error.error.text,"",{
            duration: 2000,
          });
        }
      )
    }

  alert:Alert
  cancelar(event, reserva:Pista){
    return this.reservaService.cancelar(reserva).
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

  public numeroAleatorio():string{
    return (Math.floor(Math.random() * 6) + 1).toString();
  }

}
