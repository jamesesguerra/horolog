import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicSearchComponent } from './dynamic-search.component';
import { DynamicSearchRoutingModule } from './dynamic-search-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputGroupModule } from 'primeng/inputgroup';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    imports: [
        DynamicSearchRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DividerModule,
        SharedModule,
        ReactiveFormsModule,
        DropdownModule,
        CommonModule,
        ProgressSpinnerModule,
    ],
    declarations: [DynamicSearchComponent],
})
export class DynamicSearchModule {}
