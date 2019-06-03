import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Pista } from '../Modelo/Pista';
import { Observable, Subject } from 'rxjs';
import { map, multicast, shareReplay, share } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(private http:HttpClient, private router:Router) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + sessionStorage.getItem("token")
  });

  private ws = environment.apiUrl+"/wss/";
  
  reservar(peticion:Pista): Observable<any>{
    
    let url = this.ws + "reservar";
    
    console.log(peticion)
    return this.http.post<Pista>(
      url, 
      { 
        idPista: peticion.idPista,
        idClub: peticion.idClub,
        horaInicio: peticion.horaInicio,
        precio: peticion.precio,
        duracion: peticion.duracion
       },
      { headers: this.headers }
    );
  }

  recuperarReservas(): Observable<any>{
    let url = this.ws + "misReservas";
    return this.http.post<Pista>(
      url,
      {}
      ,{ headers: this.headers }
    );
  }

  recuperarReservasClub(): Observable<any>{
    let url = this.ws + "reservas";
    return this.http.post<Pista>(
      url,
      {}
      ,{ headers: this.headers }
    );
  }

  recuperarTodasReservasClub(): Observable<any>{
    let url = this.ws + "treservas";
    return this.http.post<Pista>(
      url,
      {}
      ,{ headers: this.headers }
    );
  }

  cancelar(peticion:Pista): Observable<any>{
    let url = this.ws + "cancelar";
    return this.http.post<Pista>(
      url,
      {
        idReserva: peticion.id,
        idClub: peticion.idClub
      }
      ,{ headers: this.headers }
    );
  }

}
