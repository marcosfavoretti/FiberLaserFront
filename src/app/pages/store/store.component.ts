import { Component } from '@angular/core';
import { LogQueueComponent } from '../../widgets/log-queue/log-queue.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-store',
  imports: [
    RouterModule,
    LogQueueComponent
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {

}
