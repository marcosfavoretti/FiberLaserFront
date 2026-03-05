import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlatesTableComponent } from '../../widgets/plates-table/plates-table.component';

@Component({
  selector: 'app-store',
  imports: [
    RouterModule,
    PlatesTableComponent
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {

}
