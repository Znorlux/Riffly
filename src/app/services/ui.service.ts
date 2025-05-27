import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterType, MusicFilter } from '../models/song.model';
import { MUSIC_FILTERS, SIDEBAR_MENU } from '../core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  public sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();

  private activeFilterSubject = new BehaviorSubject<FilterType>('staff-picks');
  public activeFilter$ = this.activeFilterSubject.asObservable();

  private filtersSubject = new BehaviorSubject<MusicFilter[]>(MUSIC_FILTERS);
  public filters$ = this.filtersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  constructor() {}

  toggleSidebar(): void {
    this.sidebarCollapsedSubject.next(!this.sidebarCollapsedSubject.value);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedSubject.next(collapsed);
  }

  setActiveFilter(filterType: FilterType): void {
    const currentFilters = this.filtersSubject.value;
    const updatedFilters = currentFilters.map((filter) => ({
      ...filter,
      active: filter.type === filterType,
    }));

    this.filtersSubject.next(updatedFilters);
    this.activeFilterSubject.next(filterType);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  getSidebarMenu() {
    return SIDEBAR_MENU;
  }

  showNotification(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ): void {
    // Aquí puedes integrar SweetAlert2 o cualquier sistema de notificaciones
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}
