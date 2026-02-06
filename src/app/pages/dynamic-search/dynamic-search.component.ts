import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicSearchService } from 'src/app/services/dynamic-search.service';

interface City {
    name: string;
}

@Component({
    selector: 'app-dynamic-search',
    templateUrl: './dynamic-search.component.html',
    styleUrl: './dynamic-search.component.scss',
})
export class DynamicSearchComponent implements OnInit {
    selectByOptions = [];
    selectedSelectByOption = null;

    searchByOptions = [];
    selectedSearchByOption = null;

    query = null;
    answer: string;

    private isLoadingSubject: BehaviorSubject<boolean>;
    isLoading$: Observable<boolean>;

    constructor(private dynamicSearchService: DynamicSearchService) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    ngOnInit() {
        this.selectByOptions = [
            {
                displayName: 'Date Received',
                fieldName: 'DateReceived',
            },
            {
                displayName: 'Date Borrowed',
                fieldName: 'DateBorrowed',
            },
            {
                displayName: 'Date Returned',
                fieldName: 'DateReturned',
            },
        ];

        this.searchByOptions = [
            {
                displayName: 'Serial Number',
                fieldName: 'SerialNumber',
            },
            {
                displayName: 'Reference Number',
                fieldName: 'DateBorrowed',
            },
            {
                displayName: 'Description',
                fieldName: 'Description',
            },
        ];
    }

    search() {
        this.isLoadingSubject.next(true);

        this.dynamicSearchService
            .search(
                this.selectedSelectByOption.fieldName,
                this.selectedSearchByOption.fieldName,
                this.query,
            )
            .subscribe((answer: string) => {
                this.isLoadingSubject.next(false);
                this.answer = answer;
            });
    }

    public isNullOrWhitespace(str) {
        return !str || str.trim().length === 0;
    }
}
