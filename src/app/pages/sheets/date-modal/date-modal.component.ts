import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-modal',
  templateUrl: './date-modal.component.html',
  styleUrl: './date-modal.component.scss'
})
export class DateModalComponent {
  @Input({ required: true }) isVisible = false;
  @Input({ required: true }) title!: string;
  @Output() save = new EventEmitter<Date>();
  @Output() cancel = new EventEmitter();

  dateSelected: Date;

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    this.save.emit(this.dateSelected);
    this.dateSelected = null;
  }
}
