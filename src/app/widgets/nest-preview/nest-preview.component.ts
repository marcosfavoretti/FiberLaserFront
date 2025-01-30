import { Component, Input, OnInit } from '@angular/core';
import { IdentifiersPlate } from '../../shared/models/IdentifiersPlate';
import { CommonModule } from '@angular/common';
import { PlateComponent } from '../plate/plate.component';
import { ProductionManagerService } from '../../shared/service/ProductionManager.service';
import { ModelNestType } from '../../@core/enum/ModelNest.enum';
import { FiberLaserNest } from '../../shared/models/FiberLaserNest';

@Component({
  selector: 'app-nest-preview',
  imports: [CommonModule, PlateComponent],
  templateUrl: './nest-preview.component.html',
  styleUrl: './nest-preview.component.css'
})
export class NestPreviewComponent implements OnInit {

  public readonly nestCss: Map<string, string> = new Map([
    [ModelNestType.MODELDEFAULTNEST, ''],
    [ModelNestType.MODELDYNAPACNEST, ''],
    [ModelNestType.MODELJCBNEST, ''],
    [ModelNestType.MODELROMINEST, '']
  ]);

  constructor(private productionService: ProductionManagerService) { }

  @Input('nest') nest!: FiberLaserNest;

  ngOnInit(): void {
    this.productionService.getEventEmitter().subscribe(
      (production) => this.nest.ManagerFiberLaserNest.find(m =>
        m.IdentifiersPlates.IdentifiersPlatesID
      )
    )
  }

  nestPlates(FiberLaserNest: FiberLaserNest): IdentifiersPlate[] {
    return FiberLaserNest.ManagerFiberLaserNest.map(a => a.IdentifiersPlates);
  }

}
