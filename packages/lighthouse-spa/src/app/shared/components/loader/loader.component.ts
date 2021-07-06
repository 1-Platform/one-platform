import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() title = '';
  @Input() textClassName = '';
  @Input() spinnerClassName = '';
  constructor() {}

  ngOnInit(): void {}
}
