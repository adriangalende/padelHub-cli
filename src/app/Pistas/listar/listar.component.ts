import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/Service/service.service';
import { Pista } from 'src/app/Modelo/Pista';
import { Router } from '@angular/router';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.sass']
})
export class ListarComponent implements OnInit {

  pistas:Pista[];
  constructor(private service:ServiceService, private router:Router) { }

  ngOnInit() {
    this.service.getPistas().subscribe(data => {
      this.pistas=data;
    })
  }

}
