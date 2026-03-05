import { Component, Inject, Pipe } from '@angular/core';
import { ApiService } from '../../shared/service/Api.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DataScriptService } from '../../shared/service/DataScript.service';
import { ScriptActionButtonComponent } from "../script-action-button/script-action-button.component";
import { PopUpService } from '../../shared/service/pop-up.service';
import { LoadContentComponent } from '../load-content/load-content.component';

@Component({
  selector: 'preview-delivery',
  templateUrl: './preview-delivery.component.html',
  styleUrls: ['./preview-data.component.css'],
  imports: [AsyncPipe, CommonModule, ScriptActionButtonComponent]
})
export class PreviewDataComponent {
  public data$?: Observable<Array<{ current: boolean, data: string }[]>>;

  constructor(
    @Inject(ApiService) private api: ApiService,
    @Inject(DataScriptService) private datastore: DataScriptService,
    @Inject(PopUpService) private popupservice: PopUpService
  ) { }

  ngOnInit(): void {
    // Inicializa data$ a partir do datastore para reagir a mudanças globais
    this.data$ = this.datastore.dataScript$;

    const script$ = this.api.requestScripts().pipe(
      tap(scripts => {
        this.datastore.setNewData(scripts);
      })
    );
    
    this.popupservice.open('script', LoadContentComponent, [script$], false);
  }
}
