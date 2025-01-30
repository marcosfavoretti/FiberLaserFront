import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/service/Api.service';
import { catchError, tap } from 'rxjs';
import { TableDynamicComponent } from '../table-dynamic/table-dynamic.component';
import { tableSchema } from './const/table-schema';
import { Production } from '../../shared/models/Production';

export type displayProductionData = {
  orderNum: string;
  serialNumber: string;
  //nao tem mas ia ser legal a hora que foi feito
  type: string;
}

@Component({
  selector: 'log-queue',
  imports: [
    TableDynamicComponent
  ],
  templateUrl: './log-queue.component.html',
  styleUrl: './log-queue.component.css'
})
export class LogQueueComponent implements OnInit {
  constructor(private api: ApiService) { }
  displayData: displayProductionData[] = [];
  tableSchema = tableSchema;
  ngOnInit(): void {
    this.api.requestNotAvaiablePlates()
      .pipe(
        tap(data => {
          console.log(data)
          this.displayData = this.parseDisplayProductionData(data);
        }),
        catchError(err => { throw new Error(err) })
      )
      .subscribe();
  }

  parseDisplayProductionData(productions: Production[]): displayProductionData[] {
    const productionArr: Array<displayProductionData> = [];

    for (const production of productions) {
      const displayData = production.Identifiersplates?.map((p) => {
        return {
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



}
