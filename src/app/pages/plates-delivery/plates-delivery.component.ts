import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { ListPlatesDeliveryResponseDto } from '../../../api/fiberlaser/models/ListPlatesDeliveryResponseDto';
import { PlatesDeliveryControllerListQueryParamsStatusEnum } from '../../../api/fiberlaser/models/PlatesDeliveryControllerList';
import { ApiService } from '../../shared/service/Api.service';
import { PlateComponent } from '../../widgets/plate/plate.component';
import { IdentifiersPlate } from '../../shared/models/IdentifiersPlate';

export type DeliveryPlate = IdentifiersPlate;

export interface DeliveryProduction {
  productionId: number;
  orderNum: string;
  productName: string;
  partCode: string;
  partName: string;
  deliveredAt?: string | null;
  separator?: string | null;
  plates: DeliveryPlate[];
  selected: boolean;
}

type DeliveryView = 'pending' | 'history';

@Component({
  selector: 'app-plates-delivery',
  imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CheckboxModule, InputTextModule, PaginatorModule, ToastModule, PlateComponent],
  providers: [MessageService],
  templateUrl: './plates-delivery.component.html',
  styleUrl: './plates-delivery.component.css'
})
export class PlatesDeliveryComponent implements OnInit {
  separator = '';
  productions: DeliveryProduction[] = [];
  filters = { product: '', item: '', serial: '', order: '' };
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  loading = true;
  submitting = false;
  showSeparatorForm = false;
  view: DeliveryView = 'pending';

  constructor(private api: ApiService, private message: MessageService) {}

  ngOnInit(): void {
    this.loadPlates();
  }

  setView(view: DeliveryView): void {
    if (this.view === view) return;
    this.view = view;
    this.currentPage = 1;
    this.showSeparatorForm = false;
    this.separator = '';
    this.loadPlates();
  }

  loadPlates(): void {
    this.loading = true;
    const status = this.view === 'pending'
      ? PlatesDeliveryControllerListQueryParamsStatusEnum.pending
      : PlatesDeliveryControllerListQueryParamsStatusEnum.delivered;

    this.api.requestPlatesDeliveryList(status, this.currentPage, this.pageSize, {
        orderNum: this.filters.order || undefined,
        partCode: this.filters.item || undefined,
        productName: this.filters.product || undefined,
        serialNumber: this.filters.serial || undefined
      }).subscribe({
      next: response => {
        this.productions = this.groupByProduction(response.data);
        this.totalRecords = response.totalCount;
        this.loading = false;
      },
      error: error => {
        console.error('Erro ao carregar placas:', error);
        this.loading = false;
        this.message.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as placas não entregues.' });
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadPlates();
  }

  onPageChange(event: { page?: number; rows?: number }): void {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? this.pageSize;
    this.loadPlates();
  }

  startDelivery(): void {
    if (this.selectedGroups.length > 0) {
      this.showSeparatorForm = true;
    }
  }

  cancelDelivery(): void {
    this.showSeparatorForm = false;
    this.separator = '';
  }

  groupByProduction(items: ListPlatesDeliveryResponseDto[]): DeliveryProduction[] {
    const groups = new Map<number, DeliveryProduction>();
    for (const item of items) {
      const group = groups.get(item.ProductionID) ?? {
        productionId: item.ProductionID,
        orderNum: item.OrderNum,
        productName: item.productName,
        partCode: item.PartCode,
        partName: `${item.PartName?.data ?? ''} ${item.PartName?.description ?? ''}`.trim(),
        deliveredAt: item.deliveredData,
        separator: item.Separator,
        plates: [],
        selected: false
      };
      group.plates.push(...(item.Identifiersplates ?? []) as IdentifiersPlate[]);
      groups.set(item.ProductionID, group);
    }
    return [...groups.values()];
  }

  selectProduction(group: DeliveryProduction): void {
    if (this.view === 'pending') {
      group.selected = !group.selected;
    }
  }

  get selectedGroups(): DeliveryProduction[] {
    return this.productions.filter(group => group.selected);
  }

  submit(): void {
    if (!this.separator.trim() || this.selectedGroups.length === 0 || this.submitting) return;
    this.submitting = true;
    const deliveries = this.selectedGroups.map(group => this.api.requestPlatesDelivery({
      ProductionID: group.productionId,
      Separator: this.separator.trim()
    }));

    // O contrato recebe a produção, por isso cada grupo selecionado é registrado separadamente.
    forkJoin(deliveries).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Entrega registrada', detail: 'As placas foram registradas para retirada.' });
        this.submitting = false;
        this.showSeparatorForm = false;
        this.separator = '';
        this.loadPlates();
      },
      error: () => {
        this.submitting = false;
        this.message.add({ severity: 'error', summary: 'Erro na entrega', detail: 'Não foi possível registrar uma ou mais produções.' });
      }
    });
  }
}
