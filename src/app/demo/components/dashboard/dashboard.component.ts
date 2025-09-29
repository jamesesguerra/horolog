import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { WatchSalesReport } from 'src/app/models/watch-sales-report';
import { WatchReportService } from 'src/app/services/watch-report.service';
import { WatchMetrics } from 'src/app/models/watch-metrics';
import { brandColors } from 'src/app/helpers/color-helper';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    // chart data
    salesOverviewData: any;
    salesOverviewChartOptions: any;
    watchesByBrandData: any;
    pieChartOptions: any;
    inventoryBreakdownData: any;

    bestSellingRolexData: any;
    barChartOptions: any;

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
            
            this.pieChartOptions = {
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
        });

        this.bestSellingRolexData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Datejust Oysterquartz', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620, 540, 325, 702, 620, 540, 325],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1
                }
            ]
        };

        this.barChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
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
