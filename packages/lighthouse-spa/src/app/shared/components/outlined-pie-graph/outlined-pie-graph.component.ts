import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-outlined-pie-graph',
  templateUrl: './outlined-pie-graph.component.html',
  styleUrls: ['./outlined-pie-graph.component.scss'],
})
export class OutlinedPieGraphComponent implements OnInit {
  constructor() {}
  @Input() score = 0;
  @Input() name = '';
  ngOnInit(): void {}

  getType(): string | string | string  {
    if (this.score >= 0 && this.score <= 49) {
      return 'low';
    } else if (this.score >= 50 && this.score <= 89) {
      return 'average';
    } else if (this.score >= 90 && this.score <= 100) {
      return 'best';
    }
  }
}
