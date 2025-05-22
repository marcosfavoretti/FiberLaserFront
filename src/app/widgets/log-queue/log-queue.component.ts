import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/service/Api.service';
import { catchError, of, tap } from 'rxjs';
import { TableDynamicComponent } from '../table-dynamic/table-dynamic.component';
import { tableSchema } from './const/table-schema';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Production } from '../../shared/models/Production';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PopUpService } from '../../shared/service/pop-up.service';
import { LoadContentComponent } from '../load-content/load-content.component';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
export type displayProductionData = {
  orderNum: string;
  serialNumber: string;
  //nao tem mas ia ser legal a hora que foi feito
  type: string;
}

@Component({
  selector: 'log-queue',
  imports: [
    ToastModule,
    ConfirmPopupModule,
    TableDynamicComponent
  ],
  templateUrl: './log-queue.component.html',
  styleUrl: './log-queue.component.css'
})
export class LogQueueComponent implements OnInit {
  constructor(
    private popUp: PopUpService,
    private api: ApiService,
    private message: MessageService,
    private confirmationService: ConfirmationService) { }
  displayData: displayProductionData[] = [];
  tableSchema = tableSchema;

  ngOnInit(): void {
    this.popUp.open('loadtable', LoadContentComponent, [], false);
    this.api.requestNotAvaiablePlates()
      .pipe(
        tap(data => {
          console.log(data)
          this.displayData = this.parseDisplayProductionData(data);
          this.popUp.close('loadtable')
        }),
        catchError(err => {
          this.popUp.close('loadtable')
          this.popUp.open('table.error', ErrorPopupComponent, err.response.data.message, true);
          return of();
        })
      )
      .subscribe();
  }

  private requestReWork(plateId: number): void {
    console.log('confimation request');
    this.popUp.open('rework', LoadContentComponent, [], false);
    this.api.requestPlateRework(plateId)
      .pipe(
        tap(() => {
          this.popUp.close('rework');
          this.message.add({ severity: 'success', detail: 'Feito com sucesso', life: 3000 });
        }),
        catchError((err) => {
          this.popUp.close('rework');
          const errorMessage = err.response?.data?.message || 'Erro desconhecido';
          this.popUp.open('autorun.error', ErrorPopupComponent, errorMessage, true);
          return of();  // Retorna um observable vazio
        })
      )
      .subscribe();  // Adicione o .subscribe() para que o fluxo seja executado
  }

  parseDisplayProductionData(productions: Production[]): displayProductionData[] {
    const productionArr: Array<displayProductionData> = [];

    for (const production of productions) {
      const displayData = production.Identifiersplates?.map((p) => {
        return {
          id: p.IdentifiersPlatesID,
          orderNum: production.OrderNum,
          serialNumber: p.Serial,
          type: p.platesType,
        }
      }
      );
      productionArr.push(...displayData!);
    }
    return productionArr;
  }

  confirmation(payload: { event: Event, data: any }): void {
    this.confirmationService.confirm({
      target: payload.event.target as EventTarget,
      message: `Você quer mesmo retrabalhar a placa ${payload.data.serialNumber}?`,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Save'
      },
      accept: () => {
        this.requestReWork(payload.data.id)
      },
    });
  }

}
