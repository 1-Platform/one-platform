import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() size = 50;
  @Input() text = '';
  @Input() fill = '';

  constructor() {}

  ngOnInit(): void {
    this.fill = this.generatorFillColor(this.text, 30, 60);
  }

  /**
   * Ref: https://medium.com/@pppped/compute-an-arbitrary-color-for-user-avatar-starting-from-his-username-with-javascript-cd0675943b66
   */
  generatorFillColor(str: string, s: number, l: number): string  {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h},${s}%,${l}%)`;
  }
}
