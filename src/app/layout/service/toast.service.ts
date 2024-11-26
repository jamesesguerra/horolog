import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast = new Subject<Message>();

  constructor() { }

  showSuccess(summary: string, detail: string) {
    this.toast.next({ severity: "success", summary, detail });
  }

  showError(summary: string, detail: string) {
    this.toast.next({ severity: "error", summary, detail });
  }

  showWarning(summary: string, detail: string) {
    this.toast.next({ severity: "warn", summary, detail });
  }

  showInfo(summary: string, detail: string) {
    this.toast.next({ severity: "info", summary, detail });
  }
}
