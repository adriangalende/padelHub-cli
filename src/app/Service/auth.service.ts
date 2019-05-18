import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { Usuario } from '../Modelo/Usuario';
import {JwtResponse} from '../Modelo/JwtResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ws = "http://localhost:8080/ws/usuarios";
  private token:string

  constructor(private http:HttpClient) {
   }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  loginUser(email: string, password: string): Observable<any> {
    let url = this.ws + "/login";
    return this.http.post<Usuario>(
      url,
      {
        email:email,
        password:password
      },
      {
        headers:this.headers
      }
    ).pipe(map(data=>data));
  }

  register(usuario:Usuario):Observable<any>{
    let url = this.ws + "/alta";
    return this.http.post<Usuario>(
      url, 
      { 
        nombre: usuario.nombre,
        email: usuario.email,
        telefono:usuario.telefono,
        password: usuario.password
       },
      { headers: this.headers }
    ).pipe(map(data=>data));
  }

  logout():void{
    sessionStorage.removeItem("token");
  }

  private saveToken(token:string):void{
    sessionStorage.setItem("token", token);
  }

  private getToken():string{
    if(!this.token){
      this.token = sessionStorage.getItem("token");
    }
    return this.token;
  }

}
