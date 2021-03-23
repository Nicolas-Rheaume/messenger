import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RoomComponent } from './components/room/room.component';
import { RoomGuard } from './guards/room.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':id', component: RoomComponent, canActivate: [RoomGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
