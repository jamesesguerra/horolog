import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/demo/api/brand';
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

  constructor(private brandService: BrandService) {
    this.brandService.getBrands
  }
  
  ngOnInit(): void {
    this.brandService.getBrands().then((data) => {
      this.brands = data;
    });
  }

  filterBrands() {

  }
}
