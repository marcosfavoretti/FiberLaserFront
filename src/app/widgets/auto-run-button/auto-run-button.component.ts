import { Component } from '@angular/core';
import { ApiService } from '../../shared/service/Api.service';
import { NestManagerService } from '../../shared/service/NestManager.service';
import { PopUpService } from '../../shared/service/pop-up.service';
import { LoadContentComponent } from '../load-content/load-content.component';
import { catchError, pipe, tap } from 'rxjs';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';

@Component({
  selector: 'app-auto-run-button',
  imports: [],
  templateUrl: './auto-run-button.component.html',
  styleUrl: './auto-run-button.component.css'
})
export class AutoRunButtonComponent {
  constructor(
    private api: ApiService, private nestManager: NestManagerService, private popUp: PopUpService
  ) { }

  requestAutoRun(): void {
    this.popUp.open('reset', LoadContentComponent, [], false);
    this.api.requestAutoRun()
      .pipe(
        tap((data) => {
          this.popUp.close('autorun');
          this.nestManager.addNest(data);
          console.log('refresh request');
        }),
        catchError((err) => {
          this.popUp.close('autorun');
          this.popUp.open('autorun.error', ErrorPopupComponent, err.response.data.message, true);
          throw new Error(err);
        })
      ).subscribe()
      ;
  }
}
