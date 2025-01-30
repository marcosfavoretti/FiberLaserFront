import { Component, Input } from '@angular/core';
import { IdentifiersPlate } from '../../shared/models/IdentifiersPlate';
import { PlatesType } from '../../@core/enum/PlatesType.enum';
import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'plate',
  imports: [
    CommonModule,
    QRCodeComponent
  ],
  templateUrl: './plate.component.html',
  styleUrl: './plate.component.css'
})
export class PlateComponent{
  public types = PlatesType;
  @Input('plate') plate!: IdentifiersPlate;
}
