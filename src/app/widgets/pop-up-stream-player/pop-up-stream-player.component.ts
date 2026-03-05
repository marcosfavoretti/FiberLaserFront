import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { StreamPlayerComponent } from '../stream-player/stream-player.component';
import { environment } from '../../@core/const/environment';
import { CameraToggleService } from '../../shared/service/CameraToggle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pop-up-stream-player',
  imports: [
    DialogModule,
    StreamPlayerComponent
  ],
  templateUrl: './pop-up-stream-player.component.html',
  styleUrl: './pop-up-stream-player.component.css'
})
export class PopUpStreamPlayerComponent implements OnInit, OnDestroy {
  display: boolean = true;
  loadVideo = signal(false);
  videoUrl: string;
  private subscription: Subscription = new Subscription();

  constructor(private cameraToggleService: CameraToggleService) {
    this.videoUrl = `http://${environment.CAMERA_IP}/mystream.m3u8`;
  }

  ngOnInit(): void {
    // Sincroniza o estado inicial (já começa como true)
    this.display = this.cameraToggleService.cameraVisible();

    this.subscription.add(
      this.cameraToggleService.reopenCamera$.subscribe(() => {
        this.display = true;
        this.cameraToggleService.setVisible(true);
      })
    );
  }

  onHide() {
    this.cameraToggleService.setVisible(false);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  runVideo(){
    this.loadVideo.set(true);
  }
}
