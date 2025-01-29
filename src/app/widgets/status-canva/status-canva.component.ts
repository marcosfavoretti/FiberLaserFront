import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { WsClientService } from '../../shared/service/WsClient.service';

@Component({
  selector: 'status-canva',
  imports: [
    BadgeModule,
    OverlayBadgeModule
  ],
  templateUrl: './status-canva.component.html',
  styleUrl: './status-canva.component.css'
})
export class StatusCanvaComponent {
  constructor(public ws: WsClientService) { }
}
