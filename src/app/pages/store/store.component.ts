import { Component } from '@angular/core';
import { QueueListComponent } from '../../widgets/queue-list/queue-list.component';
import { LogQueueComponent } from '../../widgets/log-queue/log-queue.component';

@Component({
  selector: 'app-store',
  imports: [
    LogQueueComponent
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {

}
