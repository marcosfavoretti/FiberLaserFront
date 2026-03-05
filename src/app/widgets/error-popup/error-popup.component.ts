import { Component, Inject, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-error-popup',
  imports: [],
  templateUrl: './error-popup.component.html',
  styleUrl: './error-popup.component.css'
})
export class ErrorPopupComponent {
  message!: string;

  constructor(
    @Optional() @Inject(DynamicDialogConfig) public config: DynamicDialogConfig,
    @Optional() public ref: DynamicDialogRef
  ) {
    console.log('Error data received:', config?.data);
    const data = config?.data;

    this.message = this.extractErrorMessage(data);
  }

  close(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  private extractErrorMessage(data: any): string {
    if (!data) {
      return 'Erro desconhecido';
    }

    if (typeof data === 'string') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.extractErrorMessage(item)).join(', ');
    }

    // Axios Error
    if (data.response?.data) {
        const responseData = data.response.data;
        if (responseData.message) {
            return this.extractErrorMessage(responseData.message);
        }
        if (responseData.error) {
            return responseData.error;
        }
    }

    if (data.message) {
      return data.message;
    }

    return 'Erro desconhecido';
  }
}
