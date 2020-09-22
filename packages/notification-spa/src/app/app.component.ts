import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'op-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private appService: AppService,
  ) {}

  async ngOnInit() {}
}
