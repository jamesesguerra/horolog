import { NgModule } from "@angular/core";
import { SheetsRoutingModule } from "./sheets-routing.module";
import { SheetsComponent } from "./sheets.component";
import { TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { TabViewModule } from "primeng/tabview";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { SharedModule } from "src/app/shared/shared.module";
import { AddWatchComponent } from "./add-watch/add-watch.component";
import { FileUploadModule } from "primeng/fileupload";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { ContextMenuModule } from "primeng/contextmenu";
import { FilterSidebarComponent } from "./filter-sidebar/filter-sidebar.component";
import { SidebarModule } from "primeng/sidebar";

@NgModule({
    imports: [
        SheetsRoutingModule,
        TableModule,
        TabViewModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
        InputTextModule,
        ButtonModule,
        FileUploadModule,
        CheckboxModule,
        SharedModule,
        InputTextareaModule,
        InputNumberModule,
        CalendarModule,
        ContextMenuModule,
        SidebarModule,
        CommonModule
    ],
    declarations: [
        SheetsComponent,
        AddWatchComponent,
        FilterSidebarComponent
    ]
})
export class SheetsModule {}