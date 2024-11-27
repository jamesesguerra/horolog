import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Watch } from 'src/app/demo/api/watch';
import { WatchService } from 'src/app/services/watch.service';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent implements OnInit {
  watches!: Watch[];
  filteredWatches!: Watch[];
  items!: MenuItem[];
  selectedWatch!: Watch;
  searchTerm = ''
  
  brandOptions = [
    { name: "Rolex", code: "Default" },
    { name: "Patek Philippe", code: "Date" },
    { name: "Audemars Piguet", code: "Name" },
    { name: "Vacheron Constantin", code: "Rating" },
    { name: "Jaeger-LeCoultre", code: "Rating" },
    { name: "Omega", code: "Rating" },
    { name: "Breguet", code: "Rating" },
    { name: "Richard Mille", code: "Rating" },
  ];

  sortOption = this.brandOptions[0];

  isAddModalVisible = false;

  constructor(private watchService: WatchService) {

  }

  ngOnInit() {
    this.watchService.getWatches().then((data) => {
        this.watches = data;
        this.filteredWatches = data;
    });

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

  deleteWatch(watch: Watch) {
    this.filteredWatches = this.filteredWatches.filter(x => x.id !== watch.id);
  }

  markWatchAsSold(watch: Watch) {
    watch.isSold = true;
  }

  onAddWatch(watch: Watch) {
    this.isAddModalVisible = false;
    this.filteredWatches = [...this.filteredWatches, watch];
  }

  onAddCancel() {
    this.isAddModalVisible = false;
  }
}
