import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {

  private sidebarToggleSource = new Subject<void>();

  /** An observable which emits whenever the sidebar is to be toggled */
  public sidebarToggled$ = this.sidebarToggleSource.asObservable();

  /** Toggle the sidebar */
  public toggleSidebar() {
    this.sidebarToggleSource.next();
  }

}
