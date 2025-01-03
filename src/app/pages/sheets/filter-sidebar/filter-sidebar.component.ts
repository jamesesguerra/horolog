import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent implements OnInit {
  @Input({ required: true }) isVisible: boolean;
  @Output() hide = new EventEmitter();
  @Output() applyFilter = new EventEmitter<any>();
  @Output() clearFilter = new EventEmitter();

  filterForm: FormGroup;

  ngOnInit(): void {
      this.initForm();
  }

  initForm() {
    this.filterForm = new FormGroup({
      serialNumber: new FormControl(''),
      referenceNumber: new FormControl(''),
      datePurchased: new FormControl(null),
      dateSold: new FormControl(null),
      dateReceived: new FormControl(null),
      isSold: new FormControl(false),
      isBorrowed: new FormControl(false)
    })
  }

  onClearFilters() {
    this.filterForm.reset();
    this.clearFilter.emit();
  }

  onApplyFilters() {
    const {
      serialNumber,
      referenceNumber,
      datePurchased,
      dateSold,
      dateReceived,
      isSold,
      isBorrowed
    } = this.filterForm.value;

    const filters = {
      serialNumber,
      referenceNumber,
      datePurchased,
      dateSold,
      dateReceived,
      isSold,
      isBorrowed
    };
    this.applyFilter.emit(filters);
  }

  onHide() {
    this.hide.emit();
  }
}
