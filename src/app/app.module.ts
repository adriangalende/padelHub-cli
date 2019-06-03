import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import{HttpClientModule}from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
registerLocaleData(localeEs);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Services
import {ServiceService} from '../app/Service/service.service';
import { UsuarioService } from './Service/usuario.service';
import { PistasService } from './Service/pistas.service';
import { ReservaService } from './Service/reserva.service';



//Components 
import { LoginComponent } from './Usuario/login/login.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { RegistroComponent } from './Usuario/registro/registro.component';
import { ClubComponent } from './Dashboard/club/club.component';
import { BuscarPistaComponent } from './buscar-pista/buscar-pista.component';
import { ReservaComponent } from './Reserva/reserva.component';
import { UsuarioComponent } from './Dashboard/usuario/usuario.component';




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
import {MatChipsModule} from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';




 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegistroComponent,
    ClubComponent,
    BuscarPistaComponent,
    ReservaComponent,
    UsuarioComponent
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
    MatChipsModule,
    MatBadgeModule,
    MatSnackBarModule,
    NgbModule,
    AngularFontAwesomeModule,
    MatTableModule
  ],
  providers: [ServiceService, UsuarioService, PistasService, ReservaService, {
    provide: LOCALE_ID,
    useValue: 'es-ES'
  }],
  bootstrap: [AppComponent],

})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);