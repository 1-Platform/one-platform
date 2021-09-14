import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard-card',
  templateUrl: './leaderboard-card.component.html',
  styleUrls: ['./leaderboard-card.component.scss'],
})
export class LeaderboardCardComponent implements OnInit {
  @Input() projectName = '';
  @Input() projectBranch = '';
  @Input() rank = 0;
  @Input() score = 0;

  constructor() {}

  ngOnInit(): void {}
}
