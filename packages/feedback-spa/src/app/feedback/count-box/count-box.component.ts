import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'op-count-box',
  templateUrl: './count-box.component.html',
  styleUrls: ['./count-box.component.scss']
})
export class CountBoxComponent implements OnInit {

  @Input() statData: ICountBoxStat;

  progressWidth: any;

  constructor() { }

  ngOnInit() {
    if (this.statData.countNumber && this.statData.totalCountNumber) {
      const countNumber = Number(this.statData.countNumber);
      const totalCountNumber = Number(this.statData.totalCountNumber);
      this.progressWidth = Math.round((countNumber / totalCountNumber) * 100);
    } else {
      this.progressWidth = 0;
    }
  }

}

export interface ICountBoxStat {
  labelName: string;
  labelSize?: string;
  labelType?: string;
  countNumber: string;
  countSize?: string;
  themeColor: string;
  totalCountNumber?: string;
}

