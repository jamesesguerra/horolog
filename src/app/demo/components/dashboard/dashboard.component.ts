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
    styles: `
        .pie-chart-container {
            padding: 20px 50px;
        }
    `,
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

    boxPapersStatusData: any;
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
                        beginAtZero: true,
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
                labels: brands.map((b) => b.brandName),
                datasets: [
                    {
                        data: brands.map((b) => b.totalCount),
                        backgroundColor: brands.map(
                            (b) => brandColors[b.brandName] ?? '#000000'
                        ),
                        hoverBackgroundColor: brands.map(
                            (b) => brandColors[b.brandName] ?? '#000000'
                        ),
                    },
                ],
            };

            this.pieChartOptions = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor,
                        },
                    },
                },
            };
        });

        this.watchReportService
            .getInventoryBreakdown()
            .subscribe((breakdown) => {
                this.inventoryBreakdownData = {
                    labels: ['In Stock', 'Sold', 'Consigned'],
                    datasets: [
                        {
                            data: [
                                breakdown.unsoldCount,
                                breakdown.soldCount,
                                breakdown.consignedCount,
                            ],
                            backgroundColor: ['#05df72', '#fff085', '#62748e'],
                            hoverBackgroundColor: [
                                '#05df72',
                                '#fff085',
                                '#62748e',
                            ],
                        },
                    ],
                };
            });

        this.watchReportService.getMonthlyTrend().subscribe((trend) => {
            const labels = Array.from(
                new Set(trend.map((r) => r.month))
            ).sort();

            const brands = Array.from(new Set(trend.map((r) => r.brand)));

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
                    const record = trend.find(
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

            this.lineChartOptions = {
                maintainAspectRatio: false,
                aspectRatio: 0.7,
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

        this.watchReportService.getBoxPapersStatus().subscribe((status) => {
            this.boxPapersStatusData = {
                labels: status.map(s => s.status),
                datasets: [
                    {
                        label: 'Inventory Count',
                        data: status.map(s => s.totalCount),
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)', // Both
                            'rgba(75, 192, 192, 0.2)', // Box Only
                            'rgba(255, 206, 86, 0.2)', // Papers Only
                            'rgba(255, 99, 132, 0.2)', // None
                        ],
                        borderColor: [
                            'rgb(54, 162, 235)',
                            'rgb(75, 192, 192)',
                            'rgb(255, 206, 86)',
                            'rgb(255, 99, 132)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            this.barChartOptions = {
                maintainAspectRatio: false,
                aspectRatio: 0.9,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                    x: {
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
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
