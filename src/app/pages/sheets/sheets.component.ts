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
import { environment } from 'src/environments/environment';
import { DateTime } from 'luxon';
import { WatchReportService } from 'src/app/services/watch-report.service';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent implements OnInit {
  @ViewChild(FilterSidebarComponent) filterComponent!: FilterSidebarComponent;
  @ViewChild(GalleryModalComponent) galleryModal!: GalleryModalComponent;

  baseStorageDomain = environment.baseStorageDomain;

  records!: WatchRecord[];
  filteredRecords!: WatchRecord[];
  items!: MenuItem[];
  exportOptions: MenuItem[] = [
    {
      label: 'Sheets',
      icon: 'pi pi-fw pi-table',
      command: () => this.onExportSheets()
    },
    {
      label: 'Reports',
      icon: 'pi pi-fw pi-dollar',
      command: () => this.onExportReports()
    },
  ];
  selectedWatch!: WatchRecord;
  searchTerm = ''

  brandOptions: Brand[] = [{ id: 0, name: 'All' }];
  brandOption: Brand;

  modelOptions: WatchModel[];
  modelOption: WatchModel;

  isAddModalVisible = false;
  isSoldModalVisible = false;
  isPickedUpModalVisible = false;
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
    private fileService: FileService,
    private watchReportService: WatchReportService
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
      },
      error: (error) => {
        this.toastService.showError("Error", error);
      }
    });
  }

  filterWatches() {
    this.filteredRecords = this.records.filter(watch => 
      watch.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteWatch(watch: WatchRecord) {
    forkJoin({
      image: this.fileService.deleteFile(watch?.imageUrl),
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

        if (this.modelOption != null) {
          this.updateRecords();
        } else {
          this.records = [];
          this.filteredRecords = [];
        }
      },
      error: (error) => {
        this.toastService.showError("Error", error);
      }
    })
  }

  updateRecords() {
    this.isLoadingSubject.next(true);
    this.filterComponent.filterForm.reset();
    this.filterCount = 0;

    this.watchRecordService.getWatchRecords(this.modelOption?.id).subscribe({
      next: (watchRecords) => {
        this.isLoadingSubject.next(false);
        this.records = watchRecords;
        this.filteredRecords = watchRecords;
      },
      error: (error) => {
        this.isLoadingSubject.next(false);
        this.toastService.showError("Error", error);
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
      e.data = DateTime.fromISO(e.data.toISOString()).toFormat("yyyy-MM-dd'T'HH:mm:ss");
    }

    editedRecord.id = e.index;
    editedRecord[e.field] = e.data;

    if (e.data === null && e.field === 'cost') {
      this.watchRecordService.setFieldToNull("cost", editedRecord.id).subscribe();
    } else if (e.data === null) {
      return;
    }

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
      this.filteredRecords = this.filteredRecords.filter(x => x.serialNumber.toLowerCase().includes(e.serialNumber.toLowerCase()));
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

    if (e.isIndependentBrand) {
      this.watchModelService.getIndependentBrandWatchModelIds().subscribe({
        next: (modelIds) => {
          const modelIdsSet = new Set(modelIds);
          this.filteredRecords = this.filteredRecords.filter(x => 
            modelIdsSet.has(x.modelId) || x.modelId === 4 || x.modelId === 44 || x.modelId === 9);
          this.filterCount++;
        }
      });
    }

    if (e.isConsigned) {
      this.filteredRecords = this.filteredRecords.filter(x => x.isConsigned !== false);
      this.filterCount++;
    }

    if (e.isWatchVault) {
      this.filteredRecords = this.filteredRecords.filter(x => x.isWatchVault !== false);
      this.filterCount++;
    }

    if (e.isConsignedBySvg) {
      this.filteredRecords = this.filteredRecords.filter(x => x.isConsignedBySvg !== false);
      this.filterCount++;
    }
  }

  onClearFilter() {
    this.isFilterSidebarVisible = false;
    this.filterCount = 0;
    this.filteredRecords = this.records;
  }

  onShowContextMenu() {
    this.items = [];

    let items = [
      {
        label: 'Delete', 
        icon: 'pi pi-fw pi-times',
        command: () => this.deleteWatch(this.selectedWatch),
        items: []
      }
    ];

    if (!this.selectedWatch.isWatchVault) {
       items = [
        {
          label: 'Mark as Watch Vault',
          icon: 'pi pi-fw pi-lock',
          command: () => {
            const editedRecord: WatchRecord = {
              id: this.selectedWatch.id,
              isWatchVault: true
            };
            this.watchRecordService.patchWatchRecord(editedRecord).subscribe({
              next: () => {
                this.toastService.showSuccess("Success!", "Watch marked as Watch Vault.")
                this.selectedWatch.isWatchVault = true;
              }
            });
          },
          items: []
        }, ...items
      ];
    } else {
      items = [
        {
          label: 'Unmark as Watch Vault',
          icon: 'pi pi-fw pi-unlock',
          command: () => {
            const editedRecord: WatchRecord = {
              id: this.selectedWatch.id,
              isWatchVault: false
            };
            this.watchRecordService.patchWatchRecord(editedRecord).subscribe({
              next: () => {
                this.toastService.showSuccess("Success!", "Watch unmarked as Watch Vault.")
                this.selectedWatch.isWatchVault = false;
              }
            });
          },
          items: []
        }, ...items
      ];
    }

    if (!this.selectedWatch.isConsignedBySvg) {
       items = [
        {
          label: 'Mark as Consigned by SAZ AT VG',
          icon: 'pi pi-fw pi-flag-fill',
          command: () => {
            const editedRecord: WatchRecord = {
              id: this.selectedWatch.id,
              isConsignedBySvg: true
            };
            this.watchRecordService.patchWatchRecord(editedRecord).subscribe({
              next: () => {
                this.toastService.showSuccess("Success!", "Watch marked as Consigned by SAZ AT VG.")
                this.selectedWatch.isConsignedBySvg = true;
              }
            });
          },
          items: []
        }, ...items
      ];
    } else {
      items = [
        {
          label: 'Unmark as Consigned by SAZ AT VG',
          icon: 'pi pi-fw pi-flag-fill',
          command: () => {
            const editedRecord: WatchRecord = {
              id: this.selectedWatch.id,
              isConsignedBySvg: false
            };
            this.watchRecordService.patchWatchRecord(editedRecord).subscribe({
              next: () => {
                this.toastService.showSuccess("Success!", "Watch unmarked as Consigned by SAZ AT VG.")
                this.selectedWatch.isConsignedBySvg = false;
              }
            });
          },
          items: []
        }, ...items
      ];
    }

    if (!this.selectedWatch.dateReturned) {
      items = [
        {
          label: 'Mark as returned',
          icon: 'pi pi-fw pi-arrow-circle-left',
          command: () => this.onReturned(new Date()),
          items: []
        }, ...items
      ];
    }

    if (!this.selectedWatch.isConsigned) {
      items = [
        {
          label: 'Mark as consigned',
          icon: 'pi pi-fw pi-flag',
          command: () => {
            const editedRecord: WatchRecord = {
              id: this.selectedWatch.id,
              isConsigned: true
            };
            this.watchRecordService.patchWatchRecord(editedRecord).subscribe({
              next: () => {
                this.toastService.showSuccess("Success!", "Watch marked as consigned.")
                this.selectedWatch.isConsigned = true;
              }
            });
          },
          items: []
        }, ...items
      ];
    } else {
       items = [
        {
          label: 'Mark as unconsigned',
          icon: 'pi pi-fw pi-flag',
          command: () => {
            const editedRecord: WatchRecord = {
              id: this.selectedWatch.id,
              isConsigned: false
            };
            this.watchRecordService.patchWatchRecord(editedRecord).subscribe({
              next: () =>
              {
                this.toastService.showSuccess("Success!", "Watch marked as unconsigned.")
                this.selectedWatch.isConsigned = false;
              }  
            });
          },
          items: []
        }, ...items
      ];
    }

    if (this.selectedWatch.dateSold === null) {
      items = [
        {
          label: 'Mark as sold',
          icon: 'pi pi-fw pi-tag',
          command: () => this.isSoldModalVisible = true,
          items: []
        }, ...items
      ];
    } else {
      items = [
        {
          label: 'Mark as unsold',
          icon: 'pi pi-fw pi-arrow-circle-left',
          command: () => this.watchRecordService.setFieldToNull('dateSold', this.selectedWatch.id).subscribe({
            next: () => {
              this.selectedWatch.dateSold = null;
              this.toastService.showInfo("Watch unsold", "The watch has been marked as unsold")
            }
          }),
          items: []
        }, ...items
      ];
    }

    if (this.brandOption.name === 'Rolex') {
      items = [
        ...items,
        {
          label: 'Move to',
          icon: 'pi pi-fw pi-arrow-right',
          command: () => {},
          items: this.modelOptions.map(option => {
            return {
              label: option.name,
              command: () => {
                const movedWatch: WatchRecord = {};
                movedWatch.id = this.selectedWatch.id;
                movedWatch.modelId = option.id;
                this.watchRecordService.patchWatchRecord(movedWatch).subscribe({
                  next: () => {
                    this.toastService.showInfo("Record moved", "The record has been moved to another model");
                    this.filteredRecords = this.filteredRecords.filter(x => x.id !== this.selectedWatch.id);
                  }
                })
              }
            }
          })
        }
      ]
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
        this.toastService.showSuccess("Success!", "The watch record has been marked as borrowed");
      }
    });
  }

  onReturned(e: Date) {
    this.watchRecordService.patchRecordDate("dateReturned", e, this.selectedWatch.id).subscribe({
      next: () => {
        this.selectedWatch.dateBorrowed = null;
        this.selectedWatch.dateReturned = e;
        this.toastService.showSuccess("Success!", "The watch record has been marked as returned");
      }
    });
  }

  onPickedUp(e: Date) {
    this.watchRecordService.patchRecordDate("datePickedUp", e, this.selectedWatch.id).subscribe({
      next: () => {
        this.selectedWatch.datePickedUp = e;
        this.isPickedUpModalVisible = false;
        this.toastService.showSuccess("Success!", "The watch record has been marked as picked up");
      }
    });
  }

  onExportSheets() {
    this.exportService.exportSheetsAsPdf(this.filteredRecords);
    this.toastService.showSuccess("Success!", "Exported watch data");
  }

  onExportReports() {
    this.watchReportService.getBrandWatchSummary().subscribe({
      next: (summary) => {
        this.exportService.exportReportsAsPdf(summary);
        this.toastService.showSuccess("Success!", "Exported summary report");
      },
    })
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
