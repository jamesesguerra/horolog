import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrandsComponent } from './brands.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: BrandsComponent },
    ])],
    exports: [RouterModule]
})
export class BrandsRoutingModule { }