import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UiService } from '../../../services/ui.service';
import { MusicFilter, FilterType } from '../../../models/song.model';

@Component({
  selector: 'app-music-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        *ngFor="let filter of filters"
        (click)="setActiveFilter(filter.type)"
        class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
        [class.text-gray-900]="filter.active"
        [class.bg-yellow-500]="filter.active"
        [class.hover:bg-yellow-600]="filter.active"
        [class.text-white]="!filter.active"
        [class.bg-gray-800]="!filter.active"
        [class.hover:bg-gray-700]="!filter.active"
      >
        {{ filter.label }}
      </button>
    </div>
  `,
})
export class MusicFiltersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  filters: MusicFilter[] = [];

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.uiService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filters = filters;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveFilter(filterType: FilterType): void {
    this.uiService.setActiveFilter(filterType);
  }
}
