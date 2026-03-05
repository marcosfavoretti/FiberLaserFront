import { Injectable, Type } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({ providedIn: 'root' })
export class PopUpService {
  private refs: Map<string, DynamicDialogRef> = new Map();

  constructor(private dialogService: DialogService) {}

  /**
   * Abre um modal com componente customizado e fecha após a conclusão dos observables.
   * @param key - Chave única do modal.
   * @param component - Componente a ser renderizado.
   * @param data - Dados a serem passados ao componente.
   * @param observables - Lista de observables que o popup irá aguardar.
   * @param closable - Define se o modal pode ser fechado manualmente.
   */
  open(
    key: string,
    component: Type<any>,
    dataOrObservables: any[] | any = null,
    closable: boolean = false
  ): DynamicDialogRef | null {
    if (this.refs.has(key)) {
      console.warn(`PopUpService: Modal com chave "${key}" já está aberto. Fechando o anterior.`);
      this.close(key);
      // Pequeno delay para garantir que o anterior fechou antes de abrir o novo com a mesma chave
      setTimeout(() => this.open(key, component, dataOrObservables, closable), 50);
      return null; // O real ref será retornado na chamada recursiva
    }

    console.log(`PopUpService: Abrindo modal "${key}"`);

    let data = null;
    let observables: Observable<any>[] = [];

    // Se for um array de observables, tratamos como tal
    if (Array.isArray(dataOrObservables) && dataOrObservables.length > 0 && dataOrObservables[0] instanceof Observable) {
      observables = dataOrObservables;
    } else {
      // Caso contrário, tratamos como dados para o componente
      data = dataOrObservables;
    }

    try {
      const ref = this.dialogService.open(component, {
        data: data,
        closable: closable,
        modal: true,
        showHeader: closable, // Mostra o header só se for fechável manualmente
        width: 'auto',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        dismissableMask: closable
      });

      if (!ref) {
        console.error(`PopUpService: Falha ao abrir o modal "${key}". ref é null.`);
        return null;
      }

      this.refs.set(key, ref);

      // Garante que a referência seja removida do mapa quando o modal fechar
      const cleanup = () => {
        if (this.refs.has(key)) {
          console.log(`PopUpService: Limpando referência "${key}"`);
          this.refs.delete(key);
        }
      };

      ref.onClose.subscribe(cleanup);
      ref.onDestroy.subscribe(cleanup);

      if (observables.length > 0) {
        const safeObservables = observables.map(obs =>
          obs.pipe(
            catchError(err => {
              console.error(`PopUpService: Erro no observable do modal "${key}":`, err);
              return of(null);
            })
          )
        );

        forkJoin(safeObservables)
          .pipe(
            finalize(() => {
              console.log(`PopUpService: Observables finalizados para "${key}", fechando...`);
              this.close(key);
            })
          )
          .subscribe();
      }

      return ref;
    } catch (e) {
      console.error(`PopUpService: Erro fatal ao tentar abrir o modal "${key}":`, e);
      return null;
    }
  }

  close(key: string): void {
    const ref = this.refs.get(key);
    if (ref) {
      console.log(`PopUpService: Fechando "${key}" via .close()`);
      this.refs.delete(key);
      ref.close();
    }
  }
}
