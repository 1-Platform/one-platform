import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { LeaderboardCategory } from '../enum';

@Pipe({
  name: 'leaderboardLabelFormater',
})
export class LeaderboardLabelFormaterPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (
      value !== LeaderboardCategory.PWA &&
      value !== LeaderboardCategory.SEO
    ) {
      const titleCasePipe = new TitleCasePipe();
      return titleCasePipe.transform(value.replace('_', ' '));
    }
    return value;
  }
}
