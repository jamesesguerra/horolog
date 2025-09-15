import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { ToastService } from 'src/app/layout/service/toast.service';
import { WatchRecord } from 'src/app/models/watch-record';
import { FileService } from 'src/app/services/file.service';
import { WatchImageService } from 'src/app/services/watch-image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrl: './gallery-modal.component.scss'
})
export class GalleryModalComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input({ required: true }) isVisible = false;
  @Input({ required: true }) title!: string;
  @Output() cancel = new EventEmitter();
  @Output() delete = new EventEmitter();

  baseStorageDomain = environment.baseStorageDomain;

  images: any[] | undefined = [];
  responsiveOptions: any[] | undefined;
  filesToUpload: any = [];
  watchRecord: WatchRecord;
  currentIndex = 0;

  private isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private watchImageService: WatchImageService,
    private fileService: FileService,
    private toastService: ToastService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
          breakpoint: '1300px',
          numVisible: 4
      },
      {
          breakpoint: '575px',
          numVisible: 1
      }
    ];
  }

  setImages(watch: WatchRecord) {
    this.isLoadingSubject.next(true)
    this.watchRecord = watch;
    
    this.watchImageService.getWatchImagesByRecordId(watch.id).subscribe({
      next: (images: any) => {
        this.images = images;
        this.isLoadingSubject.next(false);
      }
    });
  }

  onUpload(e: any) {
    this.filesToUpload = e.files;
  }

  onSubmit() {
    this.fileUpload.upload();

    const uploadRequests  = this.filesToUpload.map(image => {
      return this.fileService.uploadFile(image);
    });

    if (uploadRequests.length > 0) {
      forkJoin(uploadRequests).subscribe({
        next: (result: any) => {
          this.filesToUpload = [];
          this.fileUpload.clear();
          this.addWatchImages(result);
        },
        error: ({ error }) => {
          this.toastService.showError("Error", error.detail);
        }
      })
    } else {
      this.toastService.showInfo("No Image/s Selected", "Please select at least 1 image to upload");
    }
  }

  addWatchImages(watchImages: any[]) {
    watchImages = watchImages.map((x) => {
      return { ...x, recordId: this.watchRecord.id };
    });

    this.watchImageService.addImages(watchImages).subscribe({
      next: () => {
        if (!this.watchRecord.imageUrl) {
          this.watchRecord.imageUrl = watchImages[0].uri;
        }
        this.toastService.showSuccess("Success!", "Watch images have been saved");
        this.isLoadingSubject.next(false);
        this.watchRecord = null;
        this.cancel.emit();
      }
    });
  }

  onIndexChange(index: number) {
    this.currentIndex = index;
  }

  onDeleteImage() {
    const imageToDelete = this.images[this.currentIndex];

    forkJoin({
      blob: this.fileService.deleteFile(imageToDelete?.uri),
      imageRecord: this.watchImageService.deleteWatchImage(imageToDelete.id)
    }).subscribe({
      next: () => {
        this.currentIndex = 0;
        this.delete.emit();
        this.toastService.showInfo("Image deleted", "The watch image has been deleted");
      },
      error: ({ error }) => {
        this.toastService.showError("Error", error.detail);
      }
    })
  }

  onCancel() {
    this.currentIndex = 0;
    this.images = [];
    this.cancel.emit();
  }
}
