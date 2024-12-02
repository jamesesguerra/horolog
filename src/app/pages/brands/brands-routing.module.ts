import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrandsComponent } from './brands.component';
import { BrandDetailComponent } from './brand-detail/brand-detail.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: BrandsComponent },
        { path: ':id', component: BrandDetailComponent }
    ])],
    exports: [RouterModule]
})
export class BrandsRoutingModule { }