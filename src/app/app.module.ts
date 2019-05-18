import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListarComponent } from './Pistas/listar/listar.component';
import {ServiceService} from '../app/Service/service.service';
import{HttpClientModule}from '@angular/common/http';
import { LoginComponent } from './Usuario/login/login.component';
import {FormsModule} from '@angular/forms';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { RegistroComponent } from './Usuario/registro/registro.component';
import { UsuarioService } from './Service/usuario.service';
import { ClubComponent } from './Dashboard/club/club.component';
 
@NgModule({
  declarations: [
    AppComponent,
    ListarComponent,
    LoginComponent,
    DashboardComponent,
    RegistroComponent,
    ClubComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ServiceService, UsuarioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
