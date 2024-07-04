import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private selectedId: string | null = null;
  private applyFilter: boolean = false;

  setSelectedId(id: string): void {
    this.selectedId = id;
    this.applyFilter = true;
  }

  getSelectedId(): string | null {
    return this.selectedId;
  }

  shouldApplyFilter(): boolean {
    return this.applyFilter;
  }

  clearFilter(): void {
    this.applyFilter = false;
    this.selectedId = null;
  }
}
