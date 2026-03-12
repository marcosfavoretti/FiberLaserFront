import { Component, Inject, Pipe, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../shared/service/Api.service';
import { Observable, tap, map } from 'rxjs';
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
  public data$?: Observable<Array<{ current: boolean, data: string }>>;
  @ViewChild('scriptContainer') scriptContainer!: ElementRef;

  constructor(
    @Inject(ApiService) private api: ApiService,
    @Inject(DataScriptService) private datastore: DataScriptService,
    @Inject(PopUpService) private popupservice: PopUpService
  ) { }

  ngOnInit(): void {
    // Inicializa data$ a partir do datastore para reagir a mudanças globais e achata o array
    this.data$ = this.datastore.dataScript$.pipe(
      map(scripts => scripts.flat()),
      tap(() => {
        // Aguarda a renderização para scrollar até o item atual
        setTimeout(() => this.scrollToCurrent(), 100);
      })
    );

    const script$ = this.api.requestScripts().pipe(
      tap(scripts => {
        this.datastore.setNewData(scripts);
      })
    );

    this.popupservice.open('script', LoadContentComponent, [script$], false);
  }

  scrollToCurrent(): void {
    if (this.scriptContainer) {
      const container = this.scriptContainer.nativeElement;
      const currentElement = container.querySelector('.text-danger');
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  scrollToBottom(): void {
    if (this.scriptContainer) {
      const container = this.scriptContainer.nativeElement;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }

  scrollScripts(direction: 'up' | 'down' | 'bottom'): void {
    if (this.scriptContainer) {
      const container = this.scriptContainer.nativeElement;
      const scrollAmount = 150;

      if (direction === 'up') {
        container.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
      } else if (direction === 'down') {
        container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      } else if (direction === 'bottom') {
        this.scrollToBottom();
      }
    }
  }
}
