import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { WatchRecordService } from 'src/app/services/watch-record.service';
import { WatchSalesReport } from 'src/app/models/watch-sales-report';
import { WatchReportService } from 'src/app/services/watch-report.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    products!: Product[];
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    bestSellingWatches: WatchSalesReport[] = [];

    recordCount: number = 0;
    totalValue: number = 0;
    averageValue: number = 0;

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private watchRecordService: WatchRecordService,
        private watchReportService: WatchReportService
    ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });

        this.watchRecordService.getWatchRecordsCount().subscribe({
            next: (count) => this.recordCount = count
        });

        this.watchReportService.getBestSellingWatches().subscribe({
            next: (watches) => this.bestSellingWatches = watches
        });

        this.watchReportService.getTotalValue().subscribe({
            next: (value) => this.totalValue = value
        });

        this.watchReportService.getAverageValue().subscribe({
            next: (value) => this.averageValue = value
        })
    }

    ngOnInit() {
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Total Sales',
                    data: [65, 59, 80, 81, 56, 55, 40, 34],
                    fill: false,
                    backgroundColor: '#21c55e',
                    borderColor: '#21c55e',
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
