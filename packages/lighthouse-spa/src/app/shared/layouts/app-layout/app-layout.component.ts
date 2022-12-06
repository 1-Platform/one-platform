import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  lighthouseServerUrl = environment.LH_SERVER_URL;
  lhDocURL = environment.LH_DOC_URL;
  sidebarFooterLinks = [
    {
      href: '/get-started/docs',
      title: 'Docs',
    },
    {
      href: '/get-started/blog',
      title: 'Blogs',
    },
    {
      href: '/contact-us',
      title: 'Contact us',
    },
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {}

  isLinkActive(url: string): boolean {
    const queryParamsIndex = this.router.url.indexOf('?');
    const baseUrl =
      queryParamsIndex === -1
        ? this.router.url
        : this.router.url.slice(0, queryParamsIndex);
    return baseUrl === url;
  }

  handleComingSoon(): void {
    window.OpNotification?.info({ subject: 'Coming soon...' });
  }
}
