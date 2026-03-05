import { Component } from '@angular/core';
import { ApiService } from '../../shared/service/Api.service';
import { NestManagerService } from '../../shared/service/NestManager.service';
import { PopUpService } from '../../shared/service/pop-up.service';
import { LoadContentComponent } from '../load-content/load-content.component';
import { catchError, delay, map, pipe, switchMap, tap, throwError } from 'rxjs';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { DataScriptService } from '@/app/shared/service/DataScript.service';

@Component({
  selector: 'app-auto-run-button',
  imports: [],
  templateUrl: './auto-run-button.component.html',
  styleUrl: './auto-run-button.component.css'
})
export class AutoRunButtonComponent {
  constructor(
    private api: ApiService,
    private nestManager: NestManagerService,
    private popUp: PopUpService,
    private datastore: DataScriptService
  ) { }

  requestAutoRun(): void {
    const run$ = this.api.requestAutoRun()
      .pipe(
        tap((data) => {
          console.log('PopUpService: AutoRun iniciado', data);
          // Atualiza o nest manager com os dados retornados pelo auto-run
          if (data) {
            this.nestManager.setNest([data]);
            console.log('PopUpService: Nest atualizado com dados do AutoRun');
          }
        }),
        // Aguardamos 500ms para o backend processar a mudança de estado
        delay(500),
        switchMap(() => {
          console.log('PopUpService: Buscando novos Scripts...');
          return this.api.requestScripts();
        }),
        tap((scripts) => {
          console.log('PopUpService: Scripts recebidos do backend:', scripts);
          this.datastore.setNewData(scripts);
          console.log('PopUpService: DataScriptService atualizado com sucesso');
          this.popUp.close('autorun');
        }),
        catchError((err) => {
          console.error('PopUpService: Erro no AutoRun:', err);
          this.popUp.close('autorun');
          this.popUp.open('autorun.error', ErrorPopupComponent, err, true);
          return throwError(() => err);
        })
      );

    this.popUp.open('autorun', LoadContentComponent, [run$], false);
  }
}
