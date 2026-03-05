import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraToggleService {
  private reopenCameraSource = new Subject<void>();
  reopenCamera$ = this.reopenCameraSource.asObservable();

  cameraVisible = signal(true);

  reopen() {
    this.reopenCameraSource.next();
    this.cameraVisible.set(true);
  }

  setVisible(visible: boolean) {
    this.cameraVisible.set(visible);
  }
}
