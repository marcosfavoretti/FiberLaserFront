import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NestPreviewComponent } from "../nest-preview/nest-preview.component";
import { FiberLaserNest } from '../../shared/models/FiberLaserNest';
import { NoDataComponent } from '../no-data/no-data.component';
import { NestManagerService } from '../../shared/service/NestManager.service';
import { DataScriptService } from '../../shared/service/DataScript.service';
import { NestHeaderComponent } from '../nest-header/nest-header.component';
import { PreviewDataComponent } from "../preview-data/preview-delivery.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-laser-nest',
  standalone: true,
  imports: [
    NestPreviewComponent,
    CommonModule,
    NoDataComponent,
    NestHeaderComponent,
    PreviewDataComponent,
  ],
  templateUrl: './laser-nest.component.html',
  styleUrl: './laser-nest.component.css'
})
export class LaserNestComponent implements OnInit {
  private nestManager = inject(NestManagerService);
  private dataScriptService = inject(DataScriptService);
  private destroyRef = inject(DestroyRef);
  private deliveryStarted = false;
  nests = signal<FiberLaserNest[]>([]);
  currentNestDone = signal<boolean>(false);

  refreshNest(): void {
    console.log('LaserNestComponent: Chamando refreshNest...');
    this.nestManager.refreshNest()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('LaserNestComponent: Refresh concluído com sucesso:', data);
          // O setNest do Manager já emite o evento getEvent(), que o componente escuta no ngOnInit.
          // No entanto, para garantir que o sinal local também seja atualizado imediatamente:
          if (data) {
            this.nests.set([data]);
            this.currentNestDone.set(false);
          } else {
            this.nests.set([]);
          }
        },
        error: (err) => {
          console.error('LaserNestComponent: Erro no refresh do componente:', err);
          this.nests.set([]);
        }
      });
  }

  ngOnInit(): void {
    this.refreshNest();

    this.nestManager.getNestCompleteEvent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentNestDone.set(true);
        this.nests.set([]);
      });

    this.nestManager.getEvent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        console.log('LaserNestComponent: Novos nests recebidos:', data);
        this.nests.set(data);
        // Se recebemos um novo nest válido, resetamos o estado de "concluído" e deliveryStarted
        if (data && data.length > 0) {
          this.currentNestDone.set(false);
          this.deliveryStarted = false;
          console.log('LaserNestComponent: Resetando currentNestDone e deliveryStarted para false');
        }
      });

    this.dataScriptService.dataScript$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(scripts => {
        const hasActiveScript = scripts.some(scriptArray =>
          scriptArray.some(script => script.current)
        );
        if (hasActiveScript) {
          this.deliveryStarted = true;
        }
        if (this.deliveryStarted && !hasActiveScript && this.nests().length > 0) {
          console.log('Delivery finalizado. Limpando dados...');
          this.nestManager.removeAllNests();
          this.nests.set([]);
          this.currentNestDone.set(false);
          this.deliveryStarted = false; // Reseta para o próximo plano
        }
      });
  }
}