import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
} )

export class AppComponent implements OnInit{
  userDetails: UserType;
  title = 'User Profile';
  footerLinks = [
    {
      category: 'Quick Links',
      links: [
        { text: 'One Platform in Mojo', href: 'https://mojo.redhat.com/groups/pnt-devops/projects/one-portal/' },
        { text: 'Weekly Blog', href: 'https://mojo.redhat.com/groups/pnt-devops/projects/one-portal/blog/' },
        { text: 'Contact Us', href: '/contact-us' },
      ]
    },
    {
      category: 'Related sites',
      links: [
        { text: 'access.redhat.com', href: 'https://access.redhat.com/' },
        { text: 'catalog.redhat.com', href: 'https://catalog.redhat.com/' },
        { text: 'connect.redhat.com', href: 'https://connect.redhat.com/' },
      ]
    },
    {
      category: 'Help',
      links: [
        { text: 'Report An Issue' },
        { text: 'One Portal FAQs', href: 'https://mojo.redhat.com/docs/DOC-1225598' },
        { text: 'one-portal@redhat.com', href: 'mailto:one-portal@redhat.com' },
        { text: 'GitHub', href: 'https://github.com/1-platform/one-platform' }
      ]
    },
  ];
  breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'User Profile', href: '/user' },
  ];

  constructor() {}
  ngOnInit() {
    const footer: any = document.querySelector('opc-footer');
    footer.opcLinkCategories = this.footerLinks;
    footer.addEventListener( 'opc-footer-link:click', () => {
      (document.querySelector('op-feedback') as any).togglePanelVisibility();
    }, false);
    (document.querySelector('#breadcrumb') as any).opcHeaderBreadcrumb = this.breadcrumbs;
  }
}
