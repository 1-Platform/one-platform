import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'op-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {
  panelItems = [
    {
      link: 'dashboard',
      title: 'Dashboard',
      active: false,
    },
    {
      link: 'manage',
      title: 'Setup notifications',
      active: false,
    }
  ];
  selectedIndex = 0;

  constructor(
    router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.panelItems = this.panelItems.map((item) => {
          if (event.urlAfterRedirects.split('/')[1] === item.link) {
            item.active = true;
          } else {
            item.active = false;
          }
          return item;
        });
      }
    });
  }

  ngOnInit(): void {}
}
