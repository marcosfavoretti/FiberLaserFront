import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FiberLaserNest } from '../../shared/models/FiberLaserNest';

@Component({
  selector: 'app-nest-header',
  imports: [],
  templateUrl: './nest-header.component.html',
  styleUrl: './nest-header.component.css'
})
export class NestHeaderComponent {
  @Input('nest') nest!: FiberLaserNest
  @Input() removeDisabled: boolean = false;
  @Output() removeRequested = new EventEmitter<Event>();

  onRemoveRequested(event: Event): void {
    this.removeRequested.emit(event);
  }
}
