import { Component, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { NavbarItem } from '../../shared/models/NavBarItem';
import { RequestRestartService } from '../../shared/service/RequestRestart.service';

@Component({
  selector: 'script-action-button',
  imports: [TitleCasePipe],
  templateUrl: './script-action-button.component.html',
  styleUrl: './script-action-button.component.css'
})
export class ScriptActionButtonComponent {
  @Input('type') type !: "DOWN" | "UP" | "RESTART";
  constructor(private scriptService: RequestRestartService) { }
  readonly configuration: { [k: string]: Required<Pick<NavbarItem, 'command'>> & NavbarItem } = {
    DOWN: {
      type: 'button',
      command: (e) => this.scriptService.requestUP(),
      label: 'Próximo',
      icon: 'pi pi-chevron-down',
    },
    UP: {
      type: 'button',
      command: (e) => this.scriptService.requestDOWN(),
      label: 'Anterior',
      icon: 'pi pi-chevron-up',
    },
    RESTART: {
      type: 'button',
      command: (e) => this.scriptService.request(),
      label: 'Reiniciar',
      icon: 'pi pi-refresh',
    }
  }
}
