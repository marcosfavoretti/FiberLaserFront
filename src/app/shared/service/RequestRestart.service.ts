import { Injectable } from "@angular/core";
import { ApiService } from "./Api.service";
import { PopUpService } from "./pop-up.service";
import { catchError, tap } from "rxjs";
import { LoadContentComponent } from "../../widgets/load-content/load-content.component";
import { ErrorPopupComponent } from "../../widgets/error-popup/error-popup.component";

@Injectable({
  providedIn: 'root'
})
export class RequestRestartService {
  constructor(
    private api: ApiService,
    private popup: PopUpService
  ) {}

  request(): void {
    this.popup.open('reset', LoadContentComponent, [], false);

    this.api.requestReset()
      .pipe(
        tap(() => this.popup.close('reset')),
        catchError((err) => {
          this.popup.close('reset');
          console.error(err.response);
          this.popup.open('error.nest', ErrorPopupComponent, [err.response?.data?.message ?? 'Erro desconhecido'], true);
          throw err;
        })
      )
      .subscribe();
  }

  requestDOWN(): void {
    this.popup.open('reset', LoadContentComponent, [], false);

    this.api.requestAction('DOWN')
      .pipe(
        tap(() => this.popup.close('reset')),
        catchError((err) => {
          this.popup.close('reset');
          console.error(err.response);
          this.popup.open('error.nest', ErrorPopupComponent, [err.response?.data?.message ?? 'Erro desconhecido'], true);
          throw err;
        })
      )
      .subscribe();
  }

  requestUP(): void {
    this.popup.open('reset', LoadContentComponent, [], false);

    this.api.requestAction('UP')
      .pipe(
        tap(() => this.popup.close('reset')),
        catchError((err) => {
          this.popup.close('reset');
          console.error(err.response);
          this.popup.open('error.nest', ErrorPopupComponent, [err.response?.data?.message ?? 'Erro desconhecido'], true);
          throw err;
        })
      )
      .subscribe();
  }
}
