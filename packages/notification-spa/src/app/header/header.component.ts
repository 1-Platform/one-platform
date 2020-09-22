import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'op-notification-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  manageBreadcrumb = false;

  constructor(
    router: Router,
  ) {
    router.events.subscribe( (event) => {
      if (event instanceof NavigationEnd) {
        const urlSubdirectory = event.urlAfterRedirects.split('/')[1];
        this.manageBreadcrumb = urlSubdirectory === 'manage' ? true : false;
      }
    });
  }

  ngOnInit(): void {
  }
}
