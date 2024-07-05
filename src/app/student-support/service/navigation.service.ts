import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private selectedId: string | null = null;
  private applyFilter: boolean = false;

  setSelectedId(id: string) {
    this.selectedId = id;
    this.applyFilter = true;
  }

  getSelectedId(): string | null {
    return this.selectedId;
  }

  shouldApplyFilter(): boolean {
    return this.applyFilter;
  }

  clearFilter() {
    this.applyFilter = false;
  }
}
