import { Component, OnInit, NgModule, ViewChild, enableProdMode, OnDestroy } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ReservaService } from 'src/app/Service/reserva.service';
import { Pista } from 'src/app/Modelo/Pista';
import * as moment from "moment";
import { PistasService } from 'src/app/Service/pistas.service';
import { first } from 'rxjs/operators';

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
  numeroPistas:number;
  listaPistas:Pista[];

  constructor(private reservaService:ReservaService, private pistaService:PistasService, private router:Router) { }

  ngOnInit() {
    if(sessionStorage.getItem("token") == undefined){
      this.router.navigateByUrl("/login")
    }
    this.cargarReservas();
  }



  private obtenerNumeroPistas(idPista){
    this.pistaService.pistasClub(idPista).subscribe(data => {
        this.listaPistas = data; 
        this.numeroPistas = data.length;
        this.generarTabla();
    });
  }

  private cargarReservas(){
      this.reservaService.recuperarReservasClub().subscribe(data => {

        if(data.success == undefined){
          this.listaReservas = data;
        } else {
          this.mensaje = data.message;
        }
    });

    this.reservaService.recuperarTodasReservasClub().subscribe(data => {
      if(data.success == undefined){
        this.listaTodasReservas = data;
        sessionStorage.setItem("listaReservas",JSON.stringify(this.listaTodasReservas));
        this.obtenerNumeroPistas(<Pista> data[0].idClub);
      } else {
        this.mensaje = data.message;
      }
  });


  }

  
  private generarTabla(){

    let listaReservas = this.ordenarReservas(JSON.parse(sessionStorage.getItem("listaReservas")));
    let tabla = document.getElementById("tablaPistas");
    //Generamos los th ( pistas del club )
    let thead = document.createElement("thead")
    let tr = document.createElement("tr");

    let thvacio = document.createElement("th");
    thvacio.scope= "col";
    tr.append(thvacio);

    this.listaPistas.forEach(pista=>{
      let th = document.createElement("th");
      th.scope= "col";
      let text = document.createTextNode(<string>pista.nombre);
      th.append(text);
      tr.append(th);
    })

    thead.append(tr);
    tabla.appendChild(thead);

    let tbody = document.createElement("tbody");

    //Generamos los horarios de 09:00 a 23:00 
    for(let i=9;i<=23;i++){
      let tr = document.createElement("tr")
      let tr2 = document.createElement("tr")
      //Añadimos las horas
      let td = document.createElement("td");
      let hora = i < 10 ? "0"+i+":00" : i+":00";
      let tdText = document.createTextNode(hora);
      td.append(tdText)
      td.rowSpan = 2;
      tr.append(td);
      //Añadimos las td para las pistas
      for(let j=0; j<this.numeroPistas; j++){
        let td = document.createElement("td");
        td.className = "pista"+(j+1)+"-"+i+"00";
        tr.append(td);
        let td2 = document.createElement("td");
        td2.className = "pista"+(j+1)+"-"+i+"30";
        tr2.append(td2);
      }

      tbody.append(tr)
      tbody.append(tr2)
    }


    tabla.appendChild(tbody)

  

  }

  private ordenarReservas(reservas):any{
    let reservasOrdenadas:any
    //primero ordenamos todas las reservas por fecha (horaInicio)
    reservasOrdenadas = this.ordenarPorFecha(reservas);
   
    //Ordenamos por nombre de pistas.
    reservasOrdenadas = this.ordenarPorPista(reservas, reservasOrdenadas);
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


}
