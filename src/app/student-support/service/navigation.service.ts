import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private selectedId: string | null = null;

  setSelectedId(id: string): void {
    this.selectedId = id;
  }

  getSelectedId(): string | null {
    return this.selectedId;
  }
}
