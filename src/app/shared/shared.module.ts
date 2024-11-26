import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { ModalComponent } from './modal/modal.component';
import { RouterModule } from '@angular/router';
import { PriceTruncatePipe } from '../pipes/price-truncate.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        StyleClassModule,
        RouterModule
    ],
    declarations: [
        ModalComponent,
        PriceTruncatePipe
    ],
    exports: [
        ModalComponent,
        PriceTruncatePipe
    ]
})
export class SharedModule {}