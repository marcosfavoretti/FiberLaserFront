import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { StreamPlayerComponent } from '../stream-player/stream-player.component';

@Component({
  selector: 'app-pop-up-stream-player',
  imports: [
    DialogModule,
    StreamPlayerComponent
  ],
  templateUrl: './pop-up-stream-player.component.html',
  styleUrl: './pop-up-stream-player.component.css'
})
export class PopUpStreamPlayerComponent {
  display: boolean = true;
  loadVideo: boolean = false;

  runVideo(){
    this.loadVideo = true;
  }
}
