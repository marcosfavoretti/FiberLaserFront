import { Component, OnInit } from '@angular/core';
import { QueueListComponent } from '../queue-list/queue-list.component';
import { MenuItem } from 'primeng/api';
import { ProductionManagerService } from '../../shared/service/ProductionManager.service';
import { Production } from '../../shared/models/Production';

export interface MenuItemModify extends MenuItem {
  label_cod_ethos: string;
  label_data_entrega: string;
  label_qtd_pecas: string;
  productionId: number;
  child?: boolean;
  tipo: string;
}


@Component({
  selector: 'plates-queue',
  imports: [
    QueueListComponent
  ],
  templateUrl: './plates-queue.component.html',
  styleUrl: './plates-queue.component.css'
})
export class PlatesQueueComponent implements OnInit {
  constructor(private productionManager: ProductionManagerService) { }
  production: Production[] = [];
  displayInfo !: MenuItemModify[];

  async ngOnInit(): Promise<void> {
    this.productionManager.refreshNest();
    this.production = this.productionManager.getProduction();
    this.productionManager.getEventEmitter().subscribe(() => {
      this.displayInfo = this.parseProductionToMenuItemModify(this.productionManager.getProduction())
    })
  }

  parseProductionToMenuItemModify(production: Production[]): Array<MenuItemModify> {
    return production
      .map(d => {
        const pedido = d.productionData?.find(a => a.TypeDataID === 410)?.Value;
        const PartCode = d.PartCode;
        const dataEntrega = d.PlannedEndTimestamp;
        console.log(dataEntrega)
        return {
          productionId: d.ProductionID,
          label_qtd_pecas: `${d.Identifiersplates?.length || 0}`,
          label_cod_ethos: `${PartCode}`,
          label_data_entrega: `${dataEntrega}`,
          icon: 'pi pi-info-circle',
          child: false,
          label: `${pedido}`,
          tipo: Array.from(new Set(d.Identifiersplates!.map(a => a.platesType))).join('/ ') ?? "None",
        }
      });
  }

}
