import { Component, OnInit } from '@angular/core';
import { DemoPlateService } from '../../shared/service/DemoPlate.service';
import { IdentifiersPlate } from '../../shared/models/IdentifiersPlate';
import { PlateComponent } from '../plate/plate.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-plates',
  imports: [CommonModule, PlateComponent],
  templateUrl: './demo-plates.component.html',
  styleUrl: './demo-plates.component.css'
})
export class DemoPlatesComponent implements OnInit {
  demoPlates: IdentifiersPlate[] = [];

  constructor(private demoPlateService: DemoPlateService) {}

  ngOnInit(): void {
    this.demoPlates = this.demoPlateService.getDemoPlates();
  }
}