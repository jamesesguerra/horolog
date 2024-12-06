import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
  searchTerm = '';
  isAddModalVisible = false;
  brands!: Brand[];
  filteredBrands!: Brand[];

  constructor(private brandService: BrandService) {
    this.brandService.getBrands
  }
  
  ngOnInit(): void {
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.filteredBrands = brands;
      }
    })
  }

  filterBrands() {
    this.filteredBrands = this.brands.filter(brand => 
      brand.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
