import { Component, Input } from '@angular/core';
import { FiberLaserNest } from '../../shared/models/FiberLaserNest';

@Component({
  selector: 'app-nest-header',
  imports: [],
  templateUrl: './nest-header.component.html',
  styleUrl: './nest-header.component.css'
})
export class NestHeaderComponent {
  @Input('nest') nest!: FiberLaserNest
}
