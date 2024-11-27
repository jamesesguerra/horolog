import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Watch } from 'src/app/demo/api/watch';
import { ToastService } from 'src/app/layout/service/toast.service';

@Component({
  selector: 'app-add-watch',
  templateUrl: './add-watch.component.html',
  styleUrl: './add-watch.component.scss'
})
export class AddWatchComponent {
  @Output() add = new EventEmitter<Watch>();
  @Output() cancel = new EventEmitter();

  watchForm: FormGroup;

  constructor(private toastService: ToastService) {
    this.initForm();
  }

  initForm() {
    this.watchForm = new FormGroup({
      description: new FormControl('', Validators.required),
      material: new FormControl('', Validators.required),
      dateOfPurchase: new FormControl(null, Validators.required),
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
    this.watchForm.reset();
    this.add.emit(
      {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqCweec0alVpPmN9TOKUM7WK_5pHfyvfuQfw&s",
        "description": formValues.description,
        "material": formValues.material,
        "dateOfPurchase": formValues.dateOfPurchase,
        "referenceNumber": formValues.referenceNumber,
        "serialNumber": formValues.serialNumber,
        "location": formValues.location,
        "box": formValues.box,
        "papers": formValues.papers,
        "cost": formValues.cost,
        "remarks": formValues.remarks
      }
    );

    this.toastService.showSuccess("Success!", "New watch record added");
  }

  onCancel() {
    this.watchForm.reset();
    this.cancel.emit();
  }

  onUpload(e: any) {

  }
}
