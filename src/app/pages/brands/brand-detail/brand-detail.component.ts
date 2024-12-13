import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { WatchModel } from 'src/app/models/watch-model';
import { ToastService } from 'src/app/layout/service/toast.service';
import { BrandService } from 'src/app/services/brand.service';
import { WatchModelService } from 'src/app/services/watch-model.service';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.scss'
})
export class BrandDetailComponent implements OnInit {
  searchTerm = '';
  watches: WatchModel[];
  filteredWatches: WatchModel[];
  brand: Brand;
  isAddModalVisible = false;

  watchModelForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  private isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private watchModelService: WatchModelService,
    private brandService: BrandService,
    private toastService: ToastService
  )
  {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  filterWatches() {
    this.filteredWatches = this.watches.filter(watch => 
      watch.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onCancel() {
    this.isAddModalVisible = false;
  }

  onSubmit() {
    const name = this.watchModelForm.value.name;

    this.watchModelService.addWatchModel({ brandId: this.brand.id, name }).subscribe({
      next: (watchModel) => {
        this.filteredWatches = [...this.filteredWatches, watchModel];
        this.watchModelForm.reset();
        this.toastService.showSuccess("Success!", "New watch model added");
        this.isAddModalVisible = false;
      },
      error: (err) => {
        this.toastService.showError("Error", err);
      }
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: paramMap => {
        const brandId = parseInt(paramMap.get("id"));

        this.isLoadingSubject.next(true);

        forkJoin({
          watchModels: this.watchModelService.getWatchModelsByBrandId(brandId),
          brand: this.brandService.getBrandById(brandId),
        }).subscribe({
          next: ({ watchModels, brand }) => {
            this.watches = watchModels;
            this.filteredWatches = watchModels;
            this.brand = brand;
            this.isLoadingSubject.next(false);
          },
          error: (err) => {
            this.toastService.showError("Error", err);
          },
        });
      }
    })
  }
}
