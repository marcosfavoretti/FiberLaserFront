import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/service/Api.service';
import { NestPreviewComponent } from "../nest-preview/nest-preview.component";
import { FiberLaserNest } from '../../shared/models/FiberLaserNest';
import { IdentifiersPlate } from '../../shared/models/IdentifiersPlate';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from '../no-data/no-data.component';
import { NestManagerService } from '../../shared/service/NestManager.service';
import { NestHeaderComponent } from '../nest-header/nest-header.component';

@Component({
  selector: 'app-laser-nest',
  imports: [NestPreviewComponent, CommonModule, NoDataComponent, NestHeaderComponent],
  templateUrl: './laser-nest.component.html',
  styleUrl: './laser-nest.component.css'
})
export class LaserNestComponent implements OnInit {
  constructor(private nestManager: NestManagerService) { }
  nests !: FiberLaserNest[];

  ngOnInit(): void {
    console.log(this.nestManager.getNests())
    this.nests = this.nestManager.getNests();
  }

  nestPlates(FiberLaserNest: FiberLaserNest): IdentifiersPlate[] {
    return FiberLaserNest.ManagerFiberLaserNest.map(a => a.IdentifiersPlates);
  }


}
