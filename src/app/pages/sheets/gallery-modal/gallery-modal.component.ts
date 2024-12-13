import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WatchImage } from 'src/app/models/watch-image';
import { WatchImageService } from 'src/app/services/watch-image.service';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrl: './gallery-modal.component.scss'
})
export class GalleryModalComponent implements OnInit {
  @Input({ required: true }) isVisible = false;
  @Input({ required: true }) title!: string;
  @Output() cancel = new EventEmitter();

  images: any[] | undefined;
  responsiveOptions: any[] | undefined;

  constructor(private watchImageService: WatchImageService) { }

  ngOnInit(): void {
    // this.watchImageService.getWatchImagesByRecordId(this.recordId).subscribe({
    //   next: (images: any) => this.images = images
    // });

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

  setImages(recordId: number) {
    this.watchImageService.getWatchImagesByRecordId(recordId).subscribe({
      next: (images: any) => this.images = images
    })
  }

  onCancel() {
    this.cancel.emit();
  }
}
