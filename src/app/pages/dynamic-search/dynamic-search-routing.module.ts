import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicSearchComponent } from './dynamic-search.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: DynamicSearchComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class DynamicSearchRoutingModule {}
