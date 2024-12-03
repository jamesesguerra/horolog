import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Brand } from 'src/app/demo/api/brand';
import { WatchModel } from 'src/app/demo/api/watch-model';
import { WatchRecord } from 'src/app/demo/api/watch-record';
import { BrandService } from 'src/app/services/brand.service';
import { WatchModelService } from 'src/app/services/watch-model.service';
import { WatchService } from 'src/app/services/watch.service';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent implements OnInit {
  watches!: WatchRecord[];
  filteredWatches!: WatchRecord[];
  items!: MenuItem[];
  selectedWatch!: WatchRecord;
  searchTerm = ''
  
  brandOptions: Brand[];
  brandOption: Brand;

  modelOptions: WatchModel[];
  modelOption: WatchModel;

  isAddModalVisible = false;

  constructor(
    private watchService: WatchService,
    private brandService: BrandService,
    private watchModelService: WatchModelService
  ) { }

  ngOnInit() {
    this.watchService.getWatches().then((data) => {
        this.watches = data;
        this.filteredWatches = data;
    });

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
    this.filteredWatches = this.watches.filter(watch => 
      watch.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteWatch(watch: WatchRecord) {
    this.filteredWatches = this.filteredWatches.filter(x => x.id !== watch.id);
  }

  markWatchAsSold(watch: WatchRecord) {
    watch.isSold = true;
  }

  onBrandChange() {
    this.updateModels();
  }

  updateModels() {
    this.watchModelService.getWatchModelsByBrandId(this.brandOption.id).subscribe({
      next: (models) => {
        this.modelOptions = models;
        this.modelOption = this.modelOptions[0];
      }
    })
  }

  onAddWatch(watch: WatchRecord) {
    this.isAddModalVisible = false;
    this.filteredWatches = [...this.filteredWatches, watch];
  }

  onAddCancel() {
    this.isAddModalVisible = false;
  }
}
