import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Sheets', icon: 'pi pi-fw pi-table', routerLink: ['/sheets'] },
                    { label: 'Analytics', icon: 'pi pi-fw pi-chart-line', routerLink: ['/sheets'] },
                    { label: 'Brands', icon: 'pi pi-fw pi-tags', routerLink: ['/sheets'] },
                ]
            },
        ];
    }
}
