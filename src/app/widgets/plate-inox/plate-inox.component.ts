import { Component, Input } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { IdentifiersPlate } from '../../shared/models/IdentifiersPlate';

@Component({
  selector: 'plate-inox',
  imports: [QRCodeComponent],
  templateUrl: './plate-inox.component.html',
  styleUrl: './plate-inox.component.css'
})
export class PlateInoxComponent {
  @Input({ required: true }) plate!: IdentifiersPlate;
}
