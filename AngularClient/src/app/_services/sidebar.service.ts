import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {

  private sidebarToggleSource = new Subject<void>();

  sidebarToggled$ = this.sidebarToggleSource.asObservable();

  toggleSidebar() {
    this.sidebarToggleSource.next();
  }

}
