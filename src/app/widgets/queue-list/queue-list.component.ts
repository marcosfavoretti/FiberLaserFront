import { Component, Input } from '@angular/core';
import { retrieveNestObjectValues } from '../../shared/util/RetrieveNestObjectValues';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { MenuItemModify } from '../plates-queue/plates-queue.component';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../shared/service/Api.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductionManagerService } from '../../shared/service/ProductionManager.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PopUpService } from '../../shared/service/pop-up.service';
import { LoadContentComponent } from '../load-content/load-content.component';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';

@Component({
  selector: 'queue-list',
  imports: [
    PanelMenuModule,
    BadgeModule,
    DatePipe,
    ToastModule,
    ConfirmPopupModule
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
  deletingPlateIds: Set<number> = new Set();
  expandedProductionIds: Set<number> = new Set();

  constructor(
    private apiService: ApiService,
    private productionManager: ProductionManagerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private popUp: PopUpService
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

  togglePlateList(productionId: number, event: Event): void {
    event.stopPropagation();

    if (this.expandedProductionIds.has(productionId)) {
      this.expandedProductionIds.delete(productionId);
      return;
    }

    this.expandedProductionIds.add(productionId);
  }

  isExpanded(productionId: number): boolean {
    return this.expandedProductionIds.has(productionId);
  }

  isDeletingPlate(plateId: number): boolean {
    return this.deletingPlateIds.has(plateId);
  }

  confirmDeletePlate(item: MenuItemModify, plateId: number, serialNumber: string, event: Event): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Você quer mesmo excluir a plaquinha ${serialNumber}?`,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Excluir',
        severity: 'danger'
      },
      accept: () => {
        this.deletePlate(item, plateId);
      },
    });
  }

  private deletePlate(item: MenuItemModify, plateId: number): void {
    if (this.deletingPlateIds.has(plateId)) {
      return;
    }

    this.deletingPlateIds.add(plateId);
    this.popUp.open('delete.plate', LoadContentComponent, [], false);

    this.apiService.requestDeletePlate(plateId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Plaquinha removida',
          detail: `A plaquinha foi excluída com sucesso.`
        });
        this.popUp.close('delete.plate');
        this.productionManager.refreshAvailablePlates().subscribe({
          next: () => {
            const currentItem = this.data.find((entry) => entry.productionId === item.productionId);
            if (!currentItem || currentItem.deletablePlates.length === 0) {
              this.expandedProductionIds.delete(item.productionId);
            }
            this.deletingPlateIds.delete(plateId);
          },
          error: (error) => {
            this.deletingPlateIds.delete(plateId);
            console.error('Erro ao recarregar produções após exclusão:', error);
          }
        });
      },
      error: (error) => {
        this.popUp.close('delete.plate');
        this.deletingPlateIds.delete(plateId);
        this.popUp.open('delete.plate.error', ErrorPopupComponent, error, true);
      }
    });
  }
}
