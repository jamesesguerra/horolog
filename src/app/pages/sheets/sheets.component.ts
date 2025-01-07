import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { WatchModel } from 'src/app/models/watch-model';
import { WatchRecord } from 'src/app/models/watch-record';
import { BrandService } from 'src/app/services/brand.service';
import { WatchModelService } from 'src/app/services/watch-model.service';
import { WatchRecordService } from 'src/app/services/watch-record.service';
import { DateService } from 'src/app/services/date.service';
import { ToastService } from 'src/app/layout/service/toast.service';
import { FilterSidebarComponent } from './filter-sidebar/filter-sidebar.component';
import { ExportService } from 'src/app/services/export.service';
import { FileService } from 'src/app/services/file.service';
import { GalleryModalComponent } from './gallery-modal/gallery-modal.component';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent implements OnInit {
  @ViewChild(FilterSidebarComponent) filterComponent!: FilterSidebarComponent;
  @ViewChild(GalleryModalComponent) galleryModal!: GalleryModalComponent;

  records!: WatchRecord[];
  filteredRecords!: WatchRecord[];
  items!: MenuItem[];
  selectedWatch!: WatchRecord;
  searchTerm = ''
  
  brandOptions: Brand[] = [{ id: 0, name: 'All' }];
  brandOption: Brand;

  modelOptions: WatchModel[];
  modelOption: WatchModel;

  isAddModalVisible = false;
  isSoldModalVisible = false;
  isBorrowedModalVisible = false;
  isReturnedModalVisible = false;
  isGalleryModalVisible = false;
  isFilterSidebarVisible = false;
  isAllBrands = false;

  filterCount = 0;

  private isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private watchRecordService: WatchRecordService,
    private brandService: BrandService,
    private watchModelService: WatchModelService,
    private toastService: ToastService,
    private dateService: DateService,
    private exportService: ExportService,
    private fileService: FileService
  )
  {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.isLoadingSubject.next(true);
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brandOptions = [...this.brandOptions, ...brands];
        this.brandOption = this.brandOptions[1];
        this.updateModels();
      }
    })
  }

  filterWatches() {
    this.filteredRecords = this.records.filter(watch => 
      watch.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteWatch(watch: WatchRecord) {
    forkJoin({
      image: this.fileService.deleteFile(this.fileService.getBlobName(watch?.imageUrl)),
      watch: this.watchRecordService.deleteWatchRecord(watch.id)
    }).subscribe({
      next: () => {
        this.filteredRecords = this.filteredRecords.filter(x => x.id !== watch.id);
        this.toastService.showInfo("Record Deleted", "The watch record has been successfully removed");
      },
      error: (error) => {
        this.toastService.showError("Error", error);
      }
    })
  }

  updateModels() {
    if (this.brandOption.id == 0) {
      this.modelOption = null;
      this.isAllBrands = true;
      this.updateRecords();
      return;
    }

    this.isAllBrands = false;

    this.watchModelService.getWatchModelsByBrandId(this.brandOption.id).subscribe({
      next: (models) => {
        this.modelOptions = models;
        this.modelOption = this.modelOptions[0];

        this.isLoadingSubject.next(false);

        if (this.modelOption != null) {
          this.updateRecords();
        } else {
          this.records = [];
          this.filteredRecords = [];
        }
      }
    })
  }

  updateRecords() {
    this.filterComponent.filterForm.reset();
    this.filterCount = 0;

    this.watchRecordService.getWatchRecords(this.modelOption?.id).subscribe({
      next: (watchRecords) => {
        this.records = watchRecords;
        this.filteredRecords = watchRecords;
      }
    })
  }

  onAddWatch(watch: WatchRecord) {
    this.isAddModalVisible = false;
    this.filteredRecords = [watch, ...this.filteredRecords];
  }

  onAddCancel() {
    this.isAddModalVisible = false;
  }

  onShowFilter() {
    this.isFilterSidebarVisible = true;
  }

  onHideFilter() {
    this.isFilterSidebarVisible = false;
  }

  onCellEditComplete(e: any) {
    const editedRecord: WatchRecord = {};
    if (e.data instanceof Date) {
      e.data =  this.dateService.convertToISOString(e.data);
    }

    editedRecord.id = e.index;
    editedRecord[e.field] = e.data;

    if (e.data === null) return;
    this.watchRecordService.patchWatchRecord(editedRecord).subscribe({
      error: (error) => {
        console.log(error);
      }
    });
  }

  onApplyFilter(e: any) {
    this.isFilterSidebarVisible = false;
    this.filteredRecords = this.records;
    this.filterCount = 0;

    if (e.serialNumber !== null && e.serialNumber.length > 0) {
      this.filteredRecords = this.filteredRecords.filter(x => x.serialNumber === e.serialNumber);
      this.filterCount++;
    }

    if (e.referenceNumber !== null && e.referenceNumber.length > 0) {
      this.filteredRecords = this.filteredRecords.filter(x => x.referenceNumber === e.referenceNumber);
      this.filterCount++;
    }

    if (e.datePurchased != null) {
      this.filteredRecords = this.dateService.applyDateFilter(
        this.filteredRecords,
        "datePurchased",
        e.datePurchased
      );
      this.filterCount++;
    }
  
    if (e.dateSold != null) {
      this.filteredRecords = this.dateService.applyDateFilter(
        this.filteredRecords,
        "dateSold",
        e.dateSold
      );
      this.filterCount++;
    }

    if (e.dateReceived != null) {
      this.filteredRecords = this.dateService.applyDateFilter(
        this.filteredRecords,
        "dateReceived",
        e.dateReceived
      );
      this.filterCount++;
    }

    if (e.isSold) {
      this.filteredRecords = this.filteredRecords.filter(x => x.dateSold !== null);
      this.filterCount++;
    }

    if (e.isBorrowed) {
      this.filteredRecords = this.filteredRecords.filter(x => x.dateBorrowed !== null);
      this.filterCount++;
    }

    if (e.isIndependentBrand) {
      this.watchModelService.getIndependentBrandWatchModelIds().subscribe({
        next: (modelIds) => {
          const modelIdsSet = new Set(modelIds);
          this.filteredRecords = this.filteredRecords.filter(x => modelIdsSet.has(x.modelId));
          this.filterCount++;
        }
      });
    }
  }

  onClearFilter() {
    this.isFilterSidebarVisible = false;
    this.filterCount = 0;
    this.filteredRecords = this.records;
  }

  onShowContextMenu() {
    this.items = [];
    let items = [{ label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteWatch(this.selectedWatch) }];
    
    if (this.selectedWatch.dateBorrowed === null) {
      items = [
        {
          label: 'Mark as borrowed',
          icon: 'pi pi-fw pi-stopwatch',
          command: () => this.isBorrowedModalVisible = true
        }, ...items
      ];
    } else {
      items = [
        {
          label: 'Mark as returned',
          icon: 'pi pi-fw pi-arrow-circle-left',
          command: () => this.isReturnedModalVisible = true
        }, ...items
      ]
    }

    if (this.selectedWatch.dateSold === null) {
      items = [
        {
          label: 'Mark as sold',
          icon: 'pi pi-fw pi-tag',
          command: () => this.isSoldModalVisible = true
        }, ...items
      ];
    }

    this.items = items;
  }

  onSold(e: Date) {
    this.watchRecordService.patchRecordDate("dateSold", e, this.selectedWatch.id).subscribe({
      next: () => {
        this.selectedWatch.dateSold = e;
        this.isSoldModalVisible = false;
        this.toastService.showSuccess("Success!", "The watch record has been marked as sold");
      }
    });
  }

  onBorrowed(e: Date) {
    this.watchRecordService.patchRecordDate("dateBorrowed", e, this.selectedWatch.id).subscribe({
      next: () => {
        this.selectedWatch.dateBorrowed = e;
        this.isBorrowedModalVisible = false;
        this.toastService.showSuccess("Success!", "The watch record has been marked as borrowed");
      }
    });
  }

  onReturned(e: Date) {
    this.watchRecordService.patchRecordDate("dateReturned", e, this.selectedWatch.id).subscribe({
      next: () => {
        this.selectedWatch.dateBorrowed = null;
        this.selectedWatch.dateReturned = e;
        this.isReturnedModalVisible = false;
        this.toastService.showSuccess("Success!", "The watch record has been marked as returned");
      }
    });
  }

  onExport() {
    this.exportService.exportTableAsPDF(this.filteredRecords);
    this.toastService.showSuccess("Success!", "Exported watch data");
  }

  onOpenGalleryModal(watch: WatchRecord) {
    this.isGalleryModalVisible = true;
    this.galleryModal.setImages(watch);
  }

  onDeleteImage() {
    this.isGalleryModalVisible = false;
    this.updateRecords();
  }
}
