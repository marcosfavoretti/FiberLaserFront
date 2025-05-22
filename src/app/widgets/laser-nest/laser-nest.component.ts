import { Component, OnInit } from '@angular/core';
import { NestPreviewComponent } from "../nest-preview/nest-preview.component";
import { FiberLaserNest } from '../../shared/models/FiberLaserNest';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from '../no-data/no-data.component';
import { NestManagerService } from '../../shared/service/NestManager.service';
import { NestHeaderComponent } from '../nest-header/nest-header.component';
import { PreviewDataComponent } from "../preview-data/preview-data.component";
import { StreamPlayerComponent } from "../stream-player/stream-player.component";

@Component({
  selector: 'app-laser-nest',
  imports: [NestPreviewComponent, CommonModule, NoDataComponent, NestHeaderComponent, PreviewDataComponent, StreamPlayerComponent],
  templateUrl: './laser-nest.component.html',
  styleUrl: './laser-nest.component.css'
})
export class LaserNestComponent implements OnInit {

  constructor(private nestManager: NestManagerService) { }
  nests !: FiberLaserNest[];
  currentNestDone: boolean = false;

  refreshNest(): void {
    this.nestManager.refreshNest();
    this.nestManager.getEvent()
      .subscribe(
        nest => this.nests = nest
      );
  }

  handleComplete(nest: FiberLaserNest): void {
    this.currentNestDone = true;
  }

  ngOnInit(): void {
    this.refreshNest();
    this.nestManager.getNestCompleteEvent()
      .subscribe(
        (nest) => {
          this.currentNestDone = true;
        }
      );
  }



}
