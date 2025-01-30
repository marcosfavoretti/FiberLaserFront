import { Component, Input } from '@angular/core';
import { retrieveNestObjectValues } from '../../shared/util/RetrieveNestObjectValues';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { MenuItemModify } from '../plates-queue/plates-queue.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'queue-list',
  imports: [
    PanelMenuModule,
    BadgeModule,
    DatePipe
  ],
  templateUrl: './queue-list.component.html',
  styleUrl: './queue-list.component.css'
})
export class QueueListComponent {
  @Input('data') data: MenuItemModify[] = [];
  auxFun = retrieveNestObjectValues;
}
