import { Component } from '@angular/core';
import {Router} from '@angular/router';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ]
})
export class AppComponent {
  title = 'padelHubClient';

  constructor(private router:Router, private adapter: DateAdapter<any>){}
  
  ngOnInit(){
    this.adapter.setLocale('es');
  }
  
  listar(){
    this.router.navigate(["listar"]);
  }
}
