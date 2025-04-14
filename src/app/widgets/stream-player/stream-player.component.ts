import { Component, ElementRef, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'app-stream-player',
  templateUrl: './stream-player.component.html',
  styleUrls: ['./stream-player.component.css']  
})
export class StreamPlayerComponent implements AfterViewInit, OnDestroy {
  @Input('videoSrc') videoSrc!: string ; 
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  private hls?: Hls;

  ngAfterViewInit(): void {
    const video = this.videoPlayer?.nativeElement;
    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(this.videoSrc);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
        this.addBufferListener(video);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.videoSrc;
      video.play();
      this.addBufferListener(video);
    } else {
      console.error('HLS não suportado neste navegador.');
    }
  }

  private addBufferListener(video: HTMLVideoElement) {
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime < video.duration - 5) {
        video.currentTime = video.duration - 5;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }
}
