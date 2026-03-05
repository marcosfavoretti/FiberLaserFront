import { Component, Input } from '@angular/core';
import { retrieveNestObjectValues } from '../../shared/util/RetrieveNestObjectValues';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { MenuItemModify } from '../plates-queue/plates-queue.component';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../shared/service/Api.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductionManagerService } from '../../shared/service/ProductionManager.service';

@Component({
  selector: 'queue-list',
  imports: [
    PanelMenuModule,
    BadgeModule,
    DatePipe,
    ToastModule
  ],
  templateUrl: './queue-list.component.html',
  styleUrl: './queue-list.component.css',
  providers: [MessageService]
})
export class QueueListComponent {
  @Input('data') data: MenuItemModify[] = [];
  auxFun = retrieveNestObjectValues;

  // Armazena IDs que estão processando prioridade
  prioritizingIds: Set<number> = new Set();

  constructor(
    private apiService: ApiService,
    private productionManager: ProductionManagerService,
    private messageService: MessageService
  ) { }

  /**
   * Solicita aumento de prioridade para uma produção
   * @param productionId ID da produção
   * @param event Evento do clique para prevenir propagação
   */
  requestPriority(productionId: number, event: Event): void {
    event.stopPropagation();

    if (this.prioritizingIds.has(productionId)) {
      return; // Já está processando
    }

    this.prioritizingIds.add(productionId);

    this.apiService.requestPriorityIncrease(productionId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Prioridade Solicitada',
          detail: `A prioridade da produção #${productionId} foi solicitada com sucesso.`
        });
        this.productionManager.refreshNest()
          .subscribe();
        this.prioritizingIds.delete(productionId);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Não foi possível solicitar prioridade para a produção #${productionId}.`
        });
        this.prioritizingIds.delete(productionId);
        console.error('Erro ao solicitar prioridade:', error);
      }
    });
  }

  /**
   * Verifica se uma produção está processando prioridade
   * @param productionId ID da produção
   */
  isPrioritizing(productionId: number): boolean {
    return this.prioritizingIds.has(productionId);
  }
}