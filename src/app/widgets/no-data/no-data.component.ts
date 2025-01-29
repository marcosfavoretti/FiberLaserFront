import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-data',
  imports: [],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.css'
})
export class NoDataComponent {
  @Input('message') message!: string;
}
