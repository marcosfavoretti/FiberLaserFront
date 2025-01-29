import { Component, Input, OnInit } from '@angular/core';
import { IdentifiersPlate } from '../../shared/models/IdentifiersPlate';
import { CommonModule } from '@angular/common';
import { PlateComponent } from '../plate/plate.component';
import { PlatesType } from '../../@core/enum/PlatesType.enum';
import { NestManagerService } from '../../shared/service/NestManager.service';
import { ProductionManagerService } from '../../shared/service/ProductionManager.service';

@Component({
  selector: 'app-nest-preview',
  imports: [CommonModule, PlateComponent],
  templateUrl: './nest-preview.component.html',
  styleUrl: './nest-preview.component.css'
})
export class NestPreviewComponent implements OnInit{

  public readonly nestCss: Map<string, { table: string, plate: string }> = new Map([
    [PlatesType.DEFAULT, { table: 'production-table-default shadow-lg p-3', plate: '' }],
    [PlatesType.DYNAPAC, { table: 'production-table-default shadow-lg p-3', plate: '' }],
    [PlatesType.JCB, { table: '', plate: '' }],
    [PlatesType.ROMI, { table: '', plate: '' }],
  ]);

  constructor(private productionManager: ProductionManagerService){}

  @Input('plates') plates!: IdentifiersPlate[];

  ngOnInit(): void {
      this.productionManager.getEventEmitter();
  }
  
}
