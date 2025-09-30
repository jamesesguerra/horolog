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

    monthlyPriceTrendData: any;
    lineChartOptions: any;

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

        this.watchReportService.getMonthlyTrend().subscribe((dbRows) => {
            const labels = Array.from(
                new Set(dbRows.map((r) => r.month))
            ).sort();

            const brands = Array.from(new Set(dbRows.map((r) => r.brand)));

            const datasets = brands.map((brand, i) => {
                const colors = [
                    '#A8D5BA',
                    '#D7BFAE',
                    '#A7C7E7',
                    '#F4A7A0',
                    '#CFCFCF',
                ];
                const color = colors[i];

                let data = labels.map((month) => {
                    const record = dbRows.find(
                        (r) => r.brand === brand && r.month === month
                    );
                    return record ? record.avgSellingPrice : null;
                });

                let lastValue: number | null = null;
                data = data.map((value) => {
                    if (value !== null) {
                        lastValue = value;
                        return value;
                    } else {
                        return lastValue;
                    }
                });

                let nextValue: number | null = null;
                for (let i = data.length - 1; i >= 0; i--) {
                    if (data[i] !== null) {
                        nextValue = data[i];
                    } else if (nextValue !== null) {
                        data[i] = nextValue;
                    }
                }

                return {
                    label: brand,
                    data,
                    fill: false,
                    backgroundColor: color,
                    borderColor: color,
                    tension: 0.4,
                };
            });
            this.monthlyPriceTrendData = {
                labels,
                datasets,
            };
        });


       this.lineChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.7,
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
