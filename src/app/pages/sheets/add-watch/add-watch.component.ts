import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WatchRecord } from 'src/app/models/watch-record';
import { ToastService } from 'src/app/layout/service/toast.service';
import { DateService } from 'src/app/services/date.service';
import { WatchRecordService } from 'src/app/services/watch-record.service';
import { FileUpload } from 'primeng/fileupload';
import { FileService } from 'src/app/services/file.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-add-watch',
  templateUrl: './add-watch.component.html',
  styleUrl: './add-watch.component.scss'
})
export class AddWatchComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input({ required: true }) modelId?: number;
  @Output() add = new EventEmitter<WatchRecord>();
  @Output() cancel = new EventEmitter();

  watchForm: FormGroup;
  fileToUpload: any;

  private isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private toastService: ToastService,
    private watchRecordService: WatchRecordService,
    private dateService: DateService,
    private fileService: FileService
  )
  {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
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
    this.fileUpload.upload();
    this.isLoadingSubject.next(true);

    if (this.fileToUpload != null) {
      this.fileService.uploadFile(this.fileToUpload).subscribe({
        next: (result: any) => this.addWatch(result.uri),
        error: (error) => {
          this.toastService.showError("Error", error);
          this.isLoadingSubject.next(false);
        }
      })
    } else {
      this.addWatch();
    }
  }

  onCancel() {
    this.watchForm.reset();
    this.cancel.emit();
  }

  onUpload(e: any) {
    this.fileToUpload = e.files[0];
  }

  private addWatch(imageUri?: string) {
    const formValues = this.watchForm.value;

    const record =
    {
      "imageUrl": imageUri ?? "https://media.istockphoto.com/id/920345886/vector/classic-wristwatch-icon.jpg?s=612x612&w=0&k=20&c=MbgyLy52hlVIOqppuIpML4XSuxFUJozffHVH0Q5jMZ4=",
      "modelId": this.modelId,
      "description": formValues.description,
      "material": formValues.material,
      "datePurchased": this.dateService.convertToISOString(formValues.datePurchased),
      "dateReceived": this.dateService.convertToISOString(formValues.dateReceived),
      "dateSold": this.dateService.convertToISOString(formValues.dateSold),
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
        this.isLoadingSubject.next(false);
      },
      error: (error) => {
        this.toastService.showError("Error", error);
        this.isLoadingSubject.next(false);
      }
    })
  }
}
