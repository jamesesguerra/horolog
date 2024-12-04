import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent {
  @Input({ required: true }) isVisible: boolean;
  @Output() hide = new EventEmitter();

  onHide() {
    this.hide.emit();
  }
}
