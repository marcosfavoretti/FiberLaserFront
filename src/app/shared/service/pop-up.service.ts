import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  private refs: Map<string, DynamicDialogRef> = new Map();

  constructor(private dialogService: DialogService) { }

  open(key: string, component: any, data: any, closable?: boolean): DynamicDialogRef {
    data = {
      closeFn: () => this.close(key),
      data: data
    };
    console.log('>>>',component)
    if(!component) throw new Error('componente vazio')
    const ref = this.dialogService.open(component, {
      data,
      style: ['bg-black'],
      width: 'auto',
      height: 'auto',
      closable: closable ?? false,
      modal: true,
    });
    //segunda request nunca vai ser esperada ate o final;
    if(!ref) console.log(':::::::::::::::::::::::::sem ref')
    ref?.onClose.subscribe(() => this.refs.delete(key));
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