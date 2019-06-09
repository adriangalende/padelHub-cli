import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http:HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  private ws = environment.apiUrl+"/ws/";

  nombreClub(idClub:number): Observable<any>{
    let url = this.ws + "nclub/"+idClub;

    return this.http.post<string>(
      url, 
      { 
       },
      { headers: this.headers }
    );
  }
}
