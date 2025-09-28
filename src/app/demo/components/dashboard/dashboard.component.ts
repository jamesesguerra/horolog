import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { WatchRecordService } from 'src/app/services/watch-record.service';
import { WatchSalesReport } from 'src/app/models/watch-sales-report';
import { WatchReportService } from 'src/app/services/watch-report.service';
import { MonthlySales } from 'src/app/models/monthly-sales';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
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
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.watchReportService.getMonthlySales().subscribe((monthlySales) => {
            this.chartData = {
                labels: monthlySales.map(s => s.monthName),
                datasets: [
                    {
                        label: 'Total Sales',
                        data: monthlySales.map(s => s.totalSold),
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
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
