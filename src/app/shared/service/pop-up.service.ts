import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  private refs: Map<string, DynamicDialogRef> = new Map();

  constructor(private dialogService: DialogService) { }

  open(key: string, component: any, data: any, closable?: boolean): DynamicDialogRef {
    if (!component) {
      throw new Error('Componente vazio');
    }

    data = {
      closeFn: () => this.close(key),
      data: data
    };

    console.log('Abrindo diálogo com componente:', component);
    
    const ref = this.dialogService.open(component, {
      data,
      style: { 'background-color': 'black' }, 
      width: 'auto',
      height: 'auto',
      closable: closable ?? false,
      modal: true,
    });

    console.log('Dialog aberto:', ref);

    if (!ref) {
      console.error('Falha ao abrir o diálogo.');
      return null!; // Retorna um valor inválido intencionalmente, para evitar erro em chamadas futuras
    }

    ref.onClose.subscribe(() => {
      setTimeout(() => this.refs.delete(key), 0); // ✅ Evita conflitos ao acessar ref já removida
    });
    
    this.refs.set(key, ref);
    return ref;
  }

  close(key: string): void {
    const ref = this.refs.get(key);
    if (ref) {
      ref.close();
      this.refs.delete(key);
    }
  }
}
