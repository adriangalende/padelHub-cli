import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import{HttpClientModule}from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Services

import {ServiceService} from '../app/Service/service.service';
import { UsuarioService } from './Service/usuario.service';
import { PistasService } from './Service/pistas.service';

//Components 

import { ListarComponent } from './Pistas/listar/listar.component';
import { LoginComponent } from './Usuario/login/login.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { RegistroComponent } from './Usuario/registro/registro.component';
import { ClubComponent } from './Dashboard/club/club.component';
import { BuscarPistaComponent } from './buscar-pista/buscar-pista.component';

//Material components
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';



 
@NgModule({
  declarations: [
    AppComponent,
    ListarComponent,
    LoginComponent,
    DashboardComponent,
    RegistroComponent,
    ClubComponent,
    BuscarPistaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMomentDateModule,
    MatExpansionModule,
    NgbModule
  ],
  providers: [ServiceService, UsuarioService, PistasService, {
    provide: LOCALE_ID,
    useValue: 'es-ES'
  }],
  bootstrap: [AppComponent],

})
export class AppModule { }
