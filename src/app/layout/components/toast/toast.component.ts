import { Component } from '@angular/core';
import { ToastService } from '../../service/toast.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  constructor(private toastService: ToastService, private messageService: MessageService) {
    this.toastService.toast
        .subscribe({
          next: (value) => {
            this.messageService.add(value);
          }
        })
  }
}
