import { Component, Input } from '@angular/core';
import { IdentifiersPlate } from '../../shared/models/IdentifiersPlate';
import { PlatesType } from '../../@core/enum/PlatesType.enum';
import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { PlateInoxComponent } from '../plate-inox/plate-inox.component';

@Component({
  selector: 'plate',
  imports: [
    CommonModule,
    QRCodeComponent,
    PlateInoxComponent
  ],
  templateUrl: './plate.component.html',
  styleUrl: './plate.component.css'
})
export class PlateComponent{
  public types = PlatesType;
  @Input('plate') plate!: IdentifiersPlate;

  get plateType(): string {
    return this.plate?.platesType === PlatesType._3DXJCBPlate
      ? PlatesType._3CXJCBPlate
      : this.plate?.platesType;
  }
}
