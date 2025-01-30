import { Component, Input } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { NavbarItem } from '../../shared/models/NavBarItem';
import { AutoRunButtonComponent } from "../auto-run-button/auto-run-button.component";
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'navbar',
  imports: [MegaMenuModule, RouterModule, OverlayBadgeModule, AutoRunButtonComponent, BadgeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',

})
export class NavbarComponent {
  @Input('itens_mid') mid_itens?: NavbarItem[]
}
