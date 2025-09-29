import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { WatchSalesReport } from 'src/app/models/watch-sales-report';
import { WatchReportService } from 'src/app/services/watch-report.service';
import { WatchMetrics } from 'src/app/models/watch-metrics';
import { brandColors } from 'src/app/helpers/color-helper';
import { BrandInventoryCount } from 'src/app/services/brand-inventory-count';
import { InventoryBreakdown } from 'src/app/services/inventory-breakdown';

@Component({
    templateUrl: './dashboard.component.html',
    styles: `
        ::ng-deep p-chart.pie-chart div {
            padding: 50px 80px;
        }
    `
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    // chart data
    salesOverviewData: any;
    salesOverviewChartOptions: any;
    watchesByBrandData: any;
    watchesByBrandChartOptions: any;
    inventoryBreakdownData: any;

    subscription!: Subscription;
    bestSellingWatches: WatchSalesReport[] = [];
    watchMetrics: WatchMetrics;

    constructor(
        public layoutService: LayoutService,
        private watchReportService: WatchReportService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initCharts();
            });

        this.watchReportService.getBestSellingWatches().subscribe({
            next: (watches) => (this.bestSellingWatches = watches),
        });

        this.watchReportService.getWatchMetrics().subscribe({
            next: (metrics) => (this.watchMetrics = metrics),
            error: (error) => console.error(error),
        });
    }

    ngOnInit() {
        this.initCharts();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.watchReportService.getMonthlySales().subscribe((monthlySales) => {
            this.salesOverviewData = {
                labels: monthlySales.map((s) => s.monthName),
                datasets: [
                    {
                        label: 'Total Sales',
                        data: monthlySales.map((s) => s.totalSold),
                        fill: true,
                        backgroundColor: 'rgba(185, 248, 207, 0.2)',
                        borderColor: '#21c55e',
                        tension: 0.4,
                    },
                ],
            };

            this.salesOverviewChartOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                },
            };
        });

        this.watchReportService.getBrandInventoryCount().subscribe((brands) => {
            this.watchesByBrandData = {
                labels: brands.map(b => b.brandName),
                datasets: [
                    {
                        data: brands.map(b => b.totalCount),
                        backgroundColor: brands.map(b => brandColors[b.brandName] ?? "#000000"),
                       hoverBackgroundColor: brands.map(b => brandColors[b.brandName] ?? "#000000"),
                    },
                ],
            };
            
            this.watchesByBrandChartOptions = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor
                        }
                    }
                }
            };
        });

        this.watchReportService.getInventoryBreakdown().subscribe((breakdown) => {
            this.inventoryBreakdownData = {
                labels: ['In Stock', 'Sold', 'Consigned'],
                datasets: [
                    {
                        data: [breakdown.unsoldCount, breakdown.soldCount, breakdown.consignedCount],
                        backgroundColor: ['#05df72', '#fff085', '#62748e'],
                        hoverBackgroundColor: ['#05df72', '#fff085', '#62748e'],
                    },
                ],
            };
        })
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
