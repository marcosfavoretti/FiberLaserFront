import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MegaMenuModule } from 'primeng/megamenu';
import { NavbarItem } from '../../shared/models/NavBarItem';
import { AutoRunButtonComponent } from "../auto-run-button/auto-run-button.component";
import { StreamPlayerComponent } from "../stream-player/stream-player.component";
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RouterModule } from '@angular/router';
import { CameraToggleService } from '../../shared/service/CameraToggle.service';

@Component({
  selector: 'navbar',
  imports: [
    CommonModule,
    MegaMenuModule,
    RouterModule,
    OverlayBadgeModule,
    AutoRunButtonComponent,
    StreamPlayerComponent,
    BadgeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input('itens_mid') mid_itens?: NavbarItem[]

  constructor(public cameraToggleService: CameraToggleService) {}

  reopenCamera() {
    this.cameraToggleService.reopen();
  }
}
