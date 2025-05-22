import { Component, Input } from '@angular/core';
import { NavbarItem } from '../../shared/models/NavBarItem';
import { RequestRestartService } from '../../shared/service/RequestRestart.service';

@Component({
  selector: 'script-action-button',
  imports: [],
  templateUrl: './script-action-button.component.html',
  styleUrl: './script-action-button.component.css'
})
export class ScriptActionButtonComponent {
  @Input('type') type !: "DOWN" | "UP" | "RESTART";
  constructor(private scriptService: RequestRestartService) { }
  readonly configuration: { [k: string]: Required<Pick<NavbarItem, 'command'>> & NavbarItem } = {
    DOWN: {
      type: 'button',
      command: (e) => this.scriptService.requestDOWN(),
      label: 'down',
      icon: 'pi pi-angle-up',
    },
    UP: {
      type: 'button',
      command: (e) => this.scriptService.requestUP(),
      label: 'up',
      icon: 'pi pi-angle-down',
    },
    RESTART: {
      type: 'button',
      command: (e) => this.scriptService.request(),
      label: 'restart',
      icon: 'pi pi-refresh',
    }
  }
}
