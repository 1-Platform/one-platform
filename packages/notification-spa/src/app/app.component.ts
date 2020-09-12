import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

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
  headerLinks = [
    {name: 'Video Guide', href: '#', icon: 'fa-play-circle'},
    {name: 'FAQs', href: '#', icon: 'fa-question-circle'},
    {name: 'Documentation', href: '#', icon: 'fa-file'}
  ];


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

  constructor(
    private appService: AppService,
  ) {}

  async ngOnInit() {
    (document.querySelector('opc-footer') as any).opcLinkCategories = this.footerLinks;
    (document.querySelector('#breadcrumb') as any).opcHeaderBreadcrumb = this.breadcrumbs;
    (document.querySelector('#links') as any).opcHeaderLinks = this.headerLinks;
  }
}
