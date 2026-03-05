import { Component, ElementRef, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import Hls from 'hls.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stream-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stream-player.component.html',
  styleUrls: ['./stream-player.component.css']
})
export class StreamPlayerComponent implements AfterViewInit, OnDestroy {
  @Input('videoSrc') videoSrc!: string;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  private hls?: Hls;
  public isPlaying: boolean = false;
  public error: string = '';
  public isLoading: boolean = true;

  ngAfterViewInit(): void {
    // Add a small delay to ensure the view is fully initialized
    setTimeout(() => {
      this.initializePlayer();
    }, 100);
  }

  initializePlayer(): void {
    const video = this.videoPlayer?.nativeElement;
    if (!video) {
      this.error = 'Elemento de vídeo não encontrado.';
      this.isLoading = false;
      return;
    }

    // Reset any previous error
    this.error = '';
    this.isLoading = true;

    try {
      if (Hls.isSupported()) {
        if (this.hls) {
          this.hls.destroy();
        }

        this.hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        this.hls.loadSource(this.videoSrc);
        this.hls.attachMedia(video);

        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('Manifest parsed successfully');
          this.isLoading = false;
          this.tryPlayVideo(video);
        });

        this.hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          this.isLoading = false;
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                this.error = 'Erro de conexão. Verifique sua rede.';
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                this.error = 'Erro de mídia. Tentando recuperar...';
                this.handleMediaError();
                break;
              default:
                this.error = `Erro fatal: ${data.details}`;
                this.hls?.destroy();
                break;
            }
          } else {
            // Non-fatal error, log but don't show to user
            console.warn('Non-fatal HLS error:', data.details);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari support
        video.src = this.videoSrc;
        video.addEventListener('loadedmetadata', () => {
          this.isLoading = false;
          this.tryPlayVideo(video);
        });
        video.addEventListener('error', (err) => {
          console.error('Video error:', err);
          this.isLoading = false;
          this.error = 'Erro ao carregar o vídeo.';
        });
      } else {
        this.isLoading = false;
        this.error = 'HLS não suportado neste navegador.';
        console.error('HLS não suportado neste navegador.');
      }
    } catch (err) {
      console.error('Erro ao inicializar o player:', err);
      this.isLoading = false;
      this.error = 'Erro ao inicializar o player de vídeo.';
    }
  }

  private handleMediaError(): void {
    if (this.hls) {
      this.hls.recoverMediaError();
    }
  }

  private tryPlayVideo(video: HTMLVideoElement): void {
    video.play()
      .then(() => {
        console.log('Video playing successfully');
        this.isPlaying = true;
        this.error = '';
      })
      .catch((err) => {
        console.error('Erro ao reproduzir vídeo:', err);
        // Don't set error for play failures, as it might be autoplay policy
        // Just mark as not playing
        this.isPlaying = false;

        // Try again after a short delay
        setTimeout(() => {
          video.play()
            .then(() => {
              this.isPlaying = true;
              this.error = '';
            })
            .catch(err => {
              console.error('Segunda tentativa de reprodução falhou:', err);
              // Still don't show error to user for autoplay issues
            });
        }, 1500);
      });
  }

  togglePlayPause(): void {
    const video = this.videoPlayer?.nativeElement;
    if (!video) return;

    if (this.isPlaying) {
      video.pause();
      this.isPlaying = false;
    } else {
      this.tryPlayVideo(video);
    }
  }

  reloadVideo(): void {
    this.initializePlayer();
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }
}
