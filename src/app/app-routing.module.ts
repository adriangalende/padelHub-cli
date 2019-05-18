import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListarComponent} from './Pistas/listar/listar.component';
import { LoginComponent } from './Usuario/login/login.component';
import {DashboardComponent} from './Dashboard/dashboard.component';
import {RegistroComponent} from './Usuario/registro/registro.component';
import { ClubComponent } from './Dashboard/club/club.component';


const routes: Routes = [
  {path:'listar', component:ListarComponent},
  {path:'login', component:LoginComponent},
  {path:'registrar', component:RegistroComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'club', component:ClubComponent},
  {path:'**', redirectTo:'/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
