import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WatchRecord } from 'src/app/models/watch-record';
import { ToastService } from 'src/app/layout/service/toast.service';
import { DateService } from 'src/app/services/date.service';
import { WatchRecordService } from 'src/app/services/watch-record.service';
import { FileUpload } from 'primeng/fileupload';
import { FileService } from 'src/app/services/file.service';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { WatchImageService } from 'src/app/services/watch-image.service';
import { DateTime } from 'luxon';

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
  filesToUpload: any = [];

  private isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private toastService: ToastService,
    private watchRecordService: WatchRecordService,
    private watchImageService: WatchImageService,
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

    const uploadRequests  = this.filesToUpload.map(image => {
      return this.fileService.uploadFile(image);
    });

    if (uploadRequests.length > 0) {
      forkJoin(uploadRequests).subscribe({
        next: (result: any) => {
          this.filesToUpload = [];
          this.fileUpload.clear();
          this.addWatch(result[0].uri, result);
        },
        error: ({ error }) => {
          this.toastService.showError("Error", error.detail);
          this.isLoadingSubject.next(false);
        }
      })
    } else {
      this.addWatch();
    }
  }

  onCancel() {
    this.watchForm.reset();
    this.fileUpload.clear();
    this.cancel.emit();
  }

  onUpload(e: any) {
    this.filesToUpload = e.files;
  }

  private addWatch(imageUri?: string, watchImages?: any[]) {
    const formValues = this.watchForm.value;

    const formatDate = (date?: Date) =>
      date ? DateTime.fromISO(date.toISOString()).toFormat("yyyy-MM-dd'T'HH:mm:ss") : undefined;

    const record =
    {
      "imageUrl": imageUri,
      "modelId": this.modelId,
      "description": formValues.description,
      "material": formValues.material,
      "datePurchased": formatDate(formValues.datePurchased),
      "dateReceived": formatDate(formValues.dateReceived),
      "dateSold": formatDate(formValues.dateSold),
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
        this.watchForm.reset({
          description: '',
          material: '',
          datePurchased: null,
          dateReceived: null,
          dateSold: null,
          referenceNumber: '',
          serialNumber: '',
          location: '',
          box: false, 
          papers: false,
          cost: null,
          remarks: '',
        });
        this.add.emit(watchRecord);
        this.toastService.showSuccess("Success!", "New watch record added");

        if (watchImages?.length > 0) {
          watchImages = watchImages.map((x) => {
            return { ...x, recordId: watchRecord.id };
          });

          this.watchImageService.addImages(watchImages).subscribe();
        }

        this.isLoadingSubject.next(false)
      },
      error: ({ error }) => {
        this.toastService.showError("Error", error.detail);
        this.isLoadingSubject.next(false);
      },
      complete: () => {
        this.isLoadingSubject.next(false);
      }
    });
  }
}
