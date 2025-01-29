import { Component, Inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-error-popup',
  imports: [],
  templateUrl: './error-popup.component.html',
  styleUrl: './error-popup.component.css'
})
export class ErrorPopupComponent {
  message!: string;

  constructor(
    @Inject(DynamicDialogConfig) public config: DynamicDialogConfig
  ) {
    console.log(config.data)
    this.message = config.data.data;
  }
}
