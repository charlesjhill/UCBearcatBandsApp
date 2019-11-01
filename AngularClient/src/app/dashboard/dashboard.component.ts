import { SidebarService } from './../_services/sidebar.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public sidebarOpen = true;

  constructor(private router: Router, private sidebarService: SidebarService) {
    this.sidebarService.sidebarToggled$.subscribe(_ => {
      this.sidebarOpen = !this.sidebarOpen;
    });
  }

  ngOnInit() {
  }

}
