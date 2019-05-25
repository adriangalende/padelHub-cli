import { Injectable } from '@angular/core';
import { PeticionPartida } from '../Modelo/PeticionPartida';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PistasService {

  constructor(private http:HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  private ws = "http://localhost:8080/ws/";

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
