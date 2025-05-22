import { Injectable, Type } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PopUpService {
  private refs: Map<string, NgbModalRef> = new Map();

  constructor(private modalService: NgbModal) {}

  /**
   * Abre um modal com componente customizado e fecha após a conclusão dos observables.
   * @param key - Chave única do modal.
   * @param component - Componente a ser renderizado.
   * @param observables - Lista de observables que o popup irá aguardar.
   * @param closable - Define se o modal pode ser fechado manualmente.
   */
  open(key: string, component: Type<any>, observables: Observable<any>[], closable: boolean = false): NgbModalRef | null {
    if (this.refs.has(key)) {
      console.warn(`Modal com chave "${key}" já está aberto.`);
      return null;
    }

    const modalRef = this.modalService.open(component, {
      backdrop: closable ? true : 'static',
      centered: true,
      keyboard: closable
    });

    const instance = modalRef.componentInstance as any;
    if (instance) {
      instance.closeFn = () => this.close(key);
    }

    this.refs.set(key, modalRef);

    const safeObservables = observables.map(obs =>
      obs.pipe(
        catchError(err => {
          console.error('Erro durante execução:', err);
          return of(null);
        })
      )
    );

    forkJoin(safeObservables)
      .pipe(
        finalize(() => this.close(key))
      )
      .subscribe(results => {
        console.log('Todas as requisições terminaram:', results);
      });

    return modalRef;
  }

  close(key: string): void {
    const ref = this.refs.get(key);
    if (ref) {
      ref.close();
      this.refs.delete(key);
    }
  }
}
