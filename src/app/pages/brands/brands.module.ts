import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrandsComponent } from "./brands.component";
import { BrandsRoutingModule } from "./brands-routing.module";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
    imports: [
        BrandsRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        CommonModule
    ],
    declarations: [BrandsComponent]
})
export class BrandsModule {}