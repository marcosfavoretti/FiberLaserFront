import { Component } from '@angular/core';
import { NavbarComponent } from '../../widgets/navbar/navbar.component';
import { PlatesQueueComponent } from '../../widgets/plates-queue/plates-queue.component';
import { LaserNestComponent } from "../../widgets/laser-nest/laser-nest.component";
import { WsClientService } from '../../shared/service/WsClient.service';
import { BadgeModule } from 'primeng/badge';
import { StatusCanvaComponent } from '../../widgets/status-canva/status-canva.component';
import { NavbarItem } from '../../shared/models/NavBarItem';
import { RequestRestartService } from '../../shared/service/RequestRestart.service';
import { PopUpStreamPlayerComponent } from "../../widgets/pop-up-stream-player/pop-up-stream-player.component";

@Component({
  selector: 'app-home',
  imports: [
    StatusCanvaComponent,
    BadgeModule,
    NavbarComponent,
    PlatesQueueComponent,
    LaserNestComponent,
    PopUpStreamPlayerComponent
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
    // {
    //   command: () => this.resService.request(),
    //   type: 'button',
    //   styleClass: '',
    //   label: 'restart',
    //   icon: 'pi pi-replay'
    // }
  ];
}
