import { Injectable } from '@angular/core';
import { PeticionPartida } from '../Modelo/PeticionPartida';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pista } from '../Modelo/Pista';

@Injectable({
  providedIn: 'root'
})
export class PistasService {

  constructor(private http:HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  private ws = environment.apiUrl+"/ws/";

  pistasClub(idClub:number): Observable<any>{
    let url = this.ws + "pistasClub/"+idClub;

    return this.http.post<any>(
      url, 
      { 
       },
      { headers: this.headers }
    ).pipe(map(data=>data));
  }

  buscarPartida(peticion:PeticionPartida): Observable<any>{
    let url = this.ws + "buscar";

    return this.http.post<PeticionPartida>(
      url, 
      { 
        horaInicio: peticion.horaInicio,
        duracion: peticion.duracion,
        flexibilidad:peticion.flexibilidad
       },
      { headers: this.headers }
    ).pipe(map(data=>data));
  }

}
