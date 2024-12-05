import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WatchRecord } from 'src/app/demo/api/watch-record';
import { ToastService } from 'src/app/layout/service/toast.service';
import { WatchRecordService } from 'src/app/services/watch-record.service';

@Component({
  selector: 'app-add-watch',
  templateUrl: './add-watch.component.html',
  styleUrl: './add-watch.component.scss'
})
export class AddWatchComponent {
  @Input({ required: true }) modelId: number;
  @Output() add = new EventEmitter<WatchRecord>();
  @Output() cancel = new EventEmitter();

  watchForm: FormGroup;

  constructor(
    private toastService: ToastService,
    private watchRecordService: WatchRecordService
  ) {
    this.initForm();
  }

  initForm() {
    this.watchForm = new FormGroup({
      description: new FormControl('', Validators.required),
      material: new FormControl('', Validators.required),
      datePurchased: new FormControl(null),
      dateReceived: new FormControl(null),
      dateSold: new FormControl(null),
      referenceNumber: new FormControl('', Validators.required),
      serialNumber: new FormControl('', Validators.required),
      location: new FormControl(''),
      box: new FormControl(false),
      papers: new FormControl(false),
      cost: new FormControl(null, Validators.required),
      remarks: new FormControl(''),
    })
  }

  onSubmit() {
    const formValues = this.watchForm.value;

    const record =
    {
      "imageUrl": "https://lucerneluxe.com/product/rolex-collection/submariner/m126610ln-0001/",
      "modelId": this.modelId,
      "description": formValues.description,
      "material": formValues.material,
      "datePurchased": formValues.datePurchased,
      "dateReceived": formValues.dateReceived,
      "dateSold": formValues.dateSold,
      "referenceNumber": formValues.referenceNumber,
      "serialNumber": formValues.serialNumber,
      "location": formValues.location,
      "hasBox": formValues.box,
      "hasPapers": formValues.papers,
      "cost": formValues.cost,
      "remarks": formValues.remarks
    }

    this.watchRecordService.addWatchRecord(record).subscribe({
      next: (watchRecord) => {
        this.watchForm.reset();
        this.add.emit(watchRecord);
        this.toastService.showSuccess("Success!", "New watch record added");
      },
      error: (error) => {
        this.toastService.showError("Error", error);
      }
    })

  }

  onCancel() {
    this.watchForm.reset();
    this.cancel.emit();
  }

  onUpload(e: any) {

  }
}
