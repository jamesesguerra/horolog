import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Brand } from 'src/app/demo/api/brand';
import { Watch } from 'src/app/demo/api/watch';
import { BrandService } from 'src/app/services/brand.service';
import { WatchService } from 'src/app/services/watch.service';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.scss'
})
export class BrandDetailComponent implements OnInit {
  searchTerm = '';
  watches: Watch[];
  filteredWatches: Watch[];
  brand: Brand;
  isAddModalVisible = false;

  watchForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  private isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private watchService: WatchService,
    private brandService: BrandService
  )
  {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  filterWatches() {
    this.filteredWatches = this.watches.filter(watch => 
      watch.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onCancel() {

  }

  onSubmit() {
    
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: paramMap => {
        const brandId = parseInt(paramMap.get("id"));

        this.isLoadingSubject.next(true);

        this.brandService.getBrandById(brandId).then((brand) => {
          this.brand = brand;
          this.isLoadingSubject.next(false);
        })
      }
    })
  }
}
