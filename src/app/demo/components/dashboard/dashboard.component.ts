import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { WatchSalesReport } from 'src/app/models/watch-sales-report';
import { WatchReportService } from 'src/app/services/watch-report.service';
import { WatchMetrics } from 'src/app/models/watch-metrics';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    chartData: any;
    chartOptions: any;
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
            this.initChart();
        });

        this.watchReportService.getBestSellingWatches().subscribe({
            next: (watches) => this.bestSellingWatches = watches
        });

        this.watchReportService.getWatchMetrics().subscribe({
            next: (metrics) => this.watchMetrics = metrics,
            error: (error) => console.error(error)
        });
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
                        fill: true,
                        backgroundColor: 'rgba(185, 248, 207, 0.2)',
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
