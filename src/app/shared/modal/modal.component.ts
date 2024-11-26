import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input({ required: true}) isVisible = false;
  @Output() hide = new EventEmitter();

  showDialog() {
      this.isVisible = true;
  }

  onHide() {
    this.hide.emit();
  }
}
