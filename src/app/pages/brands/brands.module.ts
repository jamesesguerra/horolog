import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrandsComponent } from "./brands.component";
import { BrandsRoutingModule } from "./brands-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { BrandDetailComponent } from "./brand-detail/brand-detail.component";
import { DividerModule } from "primeng/divider";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    imports: [
        BrandsRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DividerModule,
        SharedModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [BrandsComponent, BrandDetailComponent]
})
export class BrandsModule {}