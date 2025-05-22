import { Injectable } from "@angular/core";
import { ApiService } from "./Api.service";
import { PopUpService } from "./pop-up.service";
import { catchError, tap } from "rxjs";
import { LoadContentComponent } from "../../widgets/load-content/load-content.component";
import { ErrorPopupComponent } from "../../widgets/error-popup/error-popup.component";
import { of, delay, switchMap } from "rxjs";
import { DataScriptService } from "./DataScript.service";

@Injectable({
  providedIn: 'root'
})

export class RequestRestartService {
  constructor(
    private api: ApiService,
    private popup: PopUpService,
    private dataScriptService: DataScriptService
  ) { }

  request(): void {

    const reset$ = this.api.requestReset()
      .pipe(
        tap(() => this.api.requestScripts().subscribe(d=> this.dataScriptService.setNewData(d))),
        catchError((err) => {
          this.popup.close('reset');
          console.error(err.response);
          this.popup.open('error.nest', ErrorPopupComponent, [err.response?.data?.message ?? 'Erro desconhecido'], true);
          throw err;
        })
      )
    this.popup.open('reset', LoadContentComponent, [reset$], false);
  }

  requestDOWN(): void {

    const down$ = this.api.requestAction('DOWN')
      .pipe(
        tap(() => this.api.requestScripts().subscribe(d=> this.dataScriptService.setNewData(d))),
        catchError((err) => {
          this.popup.close('reset');
          console.error(err.response);
          this.popup.open('error.nest', ErrorPopupComponent, [err.response?.data?.message ?? 'Erro desconhecido'], true);
          throw err;
        })
      )

    this.popup.open('reset', LoadContentComponent, [down$], false);

  }

  requestUP(): void {
    const up$ = this.api.requestAction('UP')
      .pipe(
        tap(() => this.api.requestScripts().subscribe(d=> this.dataScriptService.setNewData(d))),
        catchError((err) => {
          this.popup.close('reset');
          console.error(err.response);
          this.popup.open('error.nest', ErrorPopupComponent, [err.response?.data?.message ?? 'Erro desconhecido'], true);
          throw err;
        })
      )
    this.popup.open('reset', LoadContentComponent, [up$], false);
  }
}
