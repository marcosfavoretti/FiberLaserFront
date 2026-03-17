import { Component, OnInit } from '@angular/core';
import { QueueListComponent } from '../queue-list/queue-list.component';
import { MenuItem } from 'primeng/api';
import { ProductionManagerService } from '../../shared/service/ProductionManager.service';
import { Production } from '../../shared/models/Production';
import { tap } from 'rxjs';

export interface MenuItemModify extends MenuItem {
  label_cod_ethos: string;
  label_data_entrega: string;
  label_qtd_pecas: string;
  label_desc: string,
  label_priority:number;
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
  constructor(private productionManager: ProductionManagerService) {
    console.log('PlatesQueueComponent construído');
  }
  production: Production[] = [];
  displayInfo: MenuItemModify[] | undefined = undefined;

  getTotalPlates(){
    return this.displayInfo?.reduce(
      (total, item) => total + parseInt(item.label_qtd_pecas, 10),
      0
    )
  }

  async ngOnInit(): Promise<void> {
    console.log('Inicializando PlatesQueueComponent');
    // Inicializar com array vazio
    this.displayInfo = [];

    // Dar um pequeno atraso para garantir que o serviço esteja pronto
    this.productionManager
      .refreshNest()
      .pipe(
        tap(
          production => {
            console.log(`productions -<<<< ${production}`, production);
            if (production && production.data.length > 0) {
              this.displayInfo = this.parseProductionToMenuItemModify(production.data);
              console.log('displayInfo atualizado:', this.displayInfo);
            } else {
              console.log('Nenhuma produção recebida no evento');
              this.displayInfo = [];
            }
          }
        )
      )
      .subscribe();

    this.productionManager
      .getEventEmitter()
      .subscribe(() => {
        const productions = this.productionManager.getProduction();
        // console.log('Evento de produção recebido:', productions);
        if (productions && productions.length > 0) {
          this.displayInfo = this.parseProductionToMenuItemModify(productions);
          console.log('displayInfo atualizado:', this.displayInfo);
        } else {
          console.log('Nenhuma produção recebida no evento');
          this.displayInfo = [];
        }
      })
  }

  parseProductionToMenuItemModify(production: Production[]): Array<MenuItemModify> {
    console.log('Parsing production data:', production);
    const result = production
      .map(d => {
        // Nota: productionData não está presente no novo DTO, então removemos essa parte
        const PartCode = d.PartCode;
        const dataEntrega = d.PlannedEndTimestamp;
        console.log('Processando item:', d);

        // Verificar se Identifiersplates existe e não é null/undefined
        const identifiersPlates = d.Identifiersplates || [];
        console.log('Identifiersplates:', identifiersPlates);

        // Verificar se há placas para determinar o tipo
        let tipo = "None";
        if (identifiersPlates.length > 0) {
          try {
            tipo = Array.from(new Set(identifiersPlates.map(a => a.platesType))).join('/ ') || "None";
          } catch (error) {
            console.error('Erro ao processar tipo:', error);
            tipo = "Erro";
          }
        }

        const menuItem: MenuItemModify = {
          label_priority: d.priority,
          label_desc: d.productName,
          productionId: d.ProductionID,
          label_qtd_pecas: `${identifiersPlates.length}`,
          label_cod_ethos: `${PartCode}`,
          label_data_entrega: `${dataEntrega}`,
          icon: 'pi pi-info-circle',
          child: false,
          label: `${d.OrderNum}`, // Usando OrderNum como fallback para o label
          tipo: tipo,
        };
        console.log('MenuItem criado:', menuItem);
        return menuItem;
      });
    console.log('Resultado do parsing:', result);
    return result;
  }

}
