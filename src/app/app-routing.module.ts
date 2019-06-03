import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Usuario/login/login.component';
import {DashboardComponent} from './Dashboard/dashboard.component';
import {RegistroComponent} from './Usuario/registro/registro.component';
import { ClubComponent } from './Dashboard/club/club.component';
import { BuscarPistaComponent } from './buscar-pista/buscar-pista.component';
import { ReservaComponent } from './Reserva/reserva.component';


const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'registrar', component:RegistroComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'club', component:ClubComponent},
  {path:'buscar', component: BuscarPistaComponent},
  {path:'reservar', component: ReservaComponent},
  {path:'**', redirectTo:'/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
