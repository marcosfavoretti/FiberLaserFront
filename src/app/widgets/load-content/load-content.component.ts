import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-load-content',
  imports: [CommonModule, DynamicDialogModule],

  templateUrl: './load-content.component.html',
  styleUrl: './load-content.component.css'
})
export class LoadContentComponent {

}
