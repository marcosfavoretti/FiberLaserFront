import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/service/Api.service';
import { catchError, of, tap } from 'rxjs';
import { TableDynamicComponent } from '../table-dynamic/table-dynamic.component';
import { tableSchema } from './const/table-schema';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PopUpService } from '../../shared/service/pop-up.service';
import { LoadContentComponent } from '../load-content/load-content.component';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import type { ListPlatesResponseDto } from '../../../api/fiberlaser/models/ListPlatesResponseDto';
import type { IdentifierPlateDto } from '../../../api/fiberlaser/models/IdentifierPlateDto';

export type DisplayPlateData = {
  id: number;
  orderNum: string;
  serialNumber: string;
  type: string;
  partCode: string;
  done: boolean;
  statusText: string;
  productionId: number;
}

@Component({
  selector: 'app-plates-table',
  imports: [
    FormsModule,
    ToastModule,
    ConfirmPopupModule,
    TableDynamicComponent,
    PaginatorModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './plates-table.component.html',
  styleUrl: './plates-table.component.css'
})
export class PlatesTableComponent implements OnInit {
  constructor(
    private popUp: PopUpService,
    private api: ApiService,
    private message: MessageService,
    private confirmationService: ConfirmationService) { }

  displayData: DisplayPlateData[] = [];
  tableSchema = tableSchema;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  filters: {
    serialNumber?: string;
    orderNum?: string;
    partCode?: string;
  } = {};

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const notAvaiable$ = this.api.requestNotAvaiablePlates(
      this.currentPage,
      this.itemsPerPage,
      this.filters
    )
      .pipe(
        tap((response: { data: ListPlatesResponseDto[], totalCount: number, totalPages: number, currentPage: number }) => {
          console.log('API Response:', response);
          this.displayData = this.parseDisplayPlateData(response.data);
          this.totalCount = response.totalCount;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.popUp.close('loadtable');
        }),
        catchError(err => {
          this.popUp.close('loadtable');
          this.popUp.open('table.error', ErrorPopupComponent, err, true);
          return of();
        })
      );

    this.popUp.open('loadtable', LoadContentComponent, [notAvaiable$], false);
  }

  private requestReWork(plateId: number): void {
    console.log('Confirmation request for plate:', plateId);
    this.popUp.open('rework', LoadContentComponent, [], false);

    this.api.requestPlateRework(plateId)
      .pipe(
        tap(() => {
          this.popUp.close('rework');
          this.message.add({ severity: 'success', detail: 'Placa enviada para retrabalho com sucesso', life: 3000 });
          // Reload data after successful rework - small delay to let popup clean up
          setTimeout(() => this.loadData(), 100);
        }),
        catchError((err) => {
          this.popUp.close('rework');
          this.popUp.open('rework.error', ErrorPopupComponent, err, true);
          return of();
        })
      )
      .subscribe();
  }

  parseDisplayPlateData(productions: ListPlatesResponseDto[]): DisplayPlateData[] {
    const plateArr: DisplayPlateData[] = [];

    for (const production of productions) {
      const plates = production.Identifiersplates?.map((plate: IdentifierPlateDto) => {
        return {
          id: plate.IdentifiersPlatesID,
          orderNum: production.OrderNum,
          serialNumber: plate.Serial,
          type: plate.platesType,
          partCode: production.PartCode,
          done: plate.Done,
          statusText: plate.Done ? 'Concluído' : 'Em Processo',
          productionId: production.ProductionID
        };
      });

      if (plates) {
        plateArr.push(...plates);
      }
    }

    return plateArr;
  }

  confirmation(payload: { event: Event, data: any }): void {
    this.confirmationService.confirm({
      target: payload.event.target as EventTarget,
      message: `Você quer mesmo retrabalhar a placa ${payload.data.serialNumber}?`,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
                  acceptButtonProps: {
                    label: 'Confirmar'
                  },
                  accept: () => {
                    setTimeout(() => this.requestReWork(payload.data.id), 0);
                  },
                });
              }  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG pages are 0-indexed
    this.itemsPerPage = event.rows;
    this.loadData();
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.loadData();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadData();
  }
}