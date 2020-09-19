import { Component, OnInit } from '@angular/core';
import * as FooterLinks from '../../../common/footer.json';
@Component({
  selector: 'op-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Notifications', href: '/notifications' },
  ];

  footerLinks = ( FooterLinks as any ).default;

  constructor() {}

  async ngOnInit() {
    const footer: any = document.querySelector('opc-footer');
    footer.opcLinkCategories = this.footerLinks;
    footer.addEventListener( 'opc-footer-link:click', () => {
      (document.querySelector('op-feedback') as any).togglePanelVisibility();
    }, false);
    (document.querySelector('#breadcrumb') as any).opcHeaderBreadcrumb = this.breadcrumbs;
  }
}
