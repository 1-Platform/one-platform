import { Component, OnInit } from '@angular/core';
import * as FooterLinks from '../../../common/footer.json';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'Feedback';
  footerLinks = (FooterLinks as any).default;
  breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Feedback', href: '/feedback' },
  ];
  headerLinks = [
    {name: 'Documentation', href: '/get-started/docs/microservices/feedback/feedback-service', icon: 'fa-file'}
  ];

  ngOnInit() {
    const footer: any = document.querySelector('opc-footer');
    footer.opcLinkCategories = this.footerLinks;
    footer.addEventListener( 'opc-footer-link:click', () => {
      (document.querySelector('op-feedback') as any).togglePanelVisibility();
    }, false);
    (document.querySelector('#breadcrumb') as any).opcHeaderBreadcrumb = this.breadcrumbs;
    (document.querySelector('#links') as any).opcHeaderLinks = this.headerLinks;
  }
}
