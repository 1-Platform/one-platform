import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  lighthouseServerUrl = environment.LH_SERVER_URL;
  constructor() {}

  ngOnInit(): void {}
}
