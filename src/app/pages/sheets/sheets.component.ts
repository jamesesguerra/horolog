import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Brand } from 'src/app/demo/api/brand';
import { WatchModel } from 'src/app/demo/api/watch-model';
import { WatchRecord } from 'src/app/demo/api/watch-record';
import { BrandService } from 'src/app/services/brand.service';
import { WatchModelService } from 'src/app/services/watch-model.service';
import { WatchRecordService } from 'src/app/services/watch-record.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent implements OnInit {
  records!: WatchRecord[];
  filteredRecords!: WatchRecord[];
  items!: MenuItem[];
  selectedWatch!: WatchRecord;
  searchTerm = ''
  
  brandOptions: Brand[];
  brandOption: Brand;

  modelOptions: WatchModel[];
  modelOption: WatchModel;

  isAddModalVisible = false;
  isFilterSidebarVisible = false;

  private isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private watchRecordService: WatchRecordService,
    private brandService: BrandService,
    private watchModelService: WatchModelService,
    private dateService: DateService
  )
  {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.isLoadingSubject.next(true);
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brandOptions = brands;
        this.brandOption = this.brandOptions[0];
        this.updateModels();
      }
    })

    this.items = [
      { label: 'Mark as sold', icon: 'pi pi-fw pi-tag', command: () => this.markWatchAsSold(this.selectedWatch) },
      { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteWatch(this.selectedWatch) }
  ];
  }

  filterWatches() {
    this.filteredRecords = this.records.filter(watch => 
      watch.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteWatch(watch: WatchRecord) {
    this.filteredRecords = this.filteredRecords.filter(x => x.id !== watch.id);
  }

  markWatchAsSold(watch: WatchRecord) {
    // watch.isSold = true;
  }

  updateModels() {
    this.watchModelService.getWatchModelsByBrandId(this.brandOption.id).subscribe({
      next: (models) => {
        this.modelOptions = models;
        this.modelOption = this.modelOptions[0];

        this.isLoadingSubject.next(false);
        this.updateRecords();
      }
    })
  }

  updateRecords() {
    this.watchRecordService.getWatchRecordsByModelId(this.modelOption.id).subscribe({
      next: (watchRecords) => {
        this.records = watchRecords;
        this.filteredRecords = watchRecords;
      }
    });
  }

  onAddWatch(watch: WatchRecord) {
    this.isAddModalVisible = false;
    this.filteredRecords = [...this.filteredRecords, watch];
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
    editedRecord.id = e.index;
    if (e.data instanceof Date) {
      e.data =  this.dateService.convertToISOString(e.data);
    }
    editedRecord[e.field] = e.data;

    if (e.data === null) return;

    this.watchRecordService.patchWatchRecord(editedRecord).subscribe({
      next: () => {
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
