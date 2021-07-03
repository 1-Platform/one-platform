import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lhcard-legend',
  templateUrl: './lhcard-legend.component.html',
  styleUrls: ['./lhcard-legend.component.scss'],
})
export class LHCardLegendComponent implements OnInit {
  @Input() align: 'right' | 'center' | 'left' = 'right';

  constructor() {}

  ngOnInit(): void {}
}
