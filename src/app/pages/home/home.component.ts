import { Component } from '@angular/core';
import { NavbarComponent } from '../../widgets/navbar/navbar.component';
import { navbar_itens_mid } from './const/navbar-itens';
import { PlatesQueueComponent } from '../../widgets/plates-queue/plates-queue.component';
import { LaserNestComponent } from "../../widgets/laser-nest/laser-nest.component";
import { WsClientService } from '../../shared/service/WsClient.service';
import { BadgeModule } from 'primeng/badge';
import { StatusCanvaComponent } from '../../widgets/status-canva/status-canva.component';
import { ApiService } from '../../shared/service/Api.service';
import { NavbarItem } from '../../shared/models/NavBarItem';
import { RequestRestartService } from '../../shared/service/RequestRestart.service';

@Component({
  selector: 'app-home',
  imports: [
    StatusCanvaComponent,
    BadgeModule,
    NavbarComponent,
    PlatesQueueComponent,
    LaserNestComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private ws: WsClientService, private resService: RequestRestartService) { }
  navbar_itens_mid: Array<NavbarItem> = [
    {
      routerLink: 'store',
      type: 'button',
      styleClass: '',
      label: 'refazer',
      icon: 'pi pi-hammer'
    },
    {
      command: () => this.resService.request(),
      type: 'button',
      styleClass: '',
      label: 'restart',
      icon: 'pi pi-replay'
    }
  ];
}
