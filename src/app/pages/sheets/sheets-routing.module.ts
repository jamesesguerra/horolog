import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SheetsComponent } from './sheets.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SheetsComponent },
    ])],
    exports: [RouterModule]
})
export class SheetsRoutingModule { }