import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { Usuario } from '../Modelo/Usuario';
import { JwtResponse } from '../Modelo/JwtResponse';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private ws = "http://localhost:8080/ws/usuarios";


  constructor(private http:HttpClient) {}

   headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  permisos(token:string):Observable<any>{
      let url = this.ws + "/permisos";
      return this.http.post<String>(
        url,
        {
          token: token
        },
        {headers: this.headers}
      ).pipe(map(data=>data));
  }
}
