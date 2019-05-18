import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Pista} from '../Modelo/Pista';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http:HttpClient) { }

  url='http://localhost:8080/ws/pistas';

  getPistas(){
    return this.http.get<Pista[]>(this.url);
  }

}
