import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { LHScoreLabelFormaterPipe } from 'app/shared/pipes/lhscore-label-formater.pipe';

@Pipe({
  name: 'timelineScoreFormater',
})
export class TimelineScoreFormaterPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  parseTimeLineForAScoreType(scoreType: string, branch: ProjectBranch[]) {
    const formatDate = new DatePipe(this.locale);
    return branch
      .filter(({ score }) => Boolean(score)) // filter out null score
      .map(({ score, updatedAt }) => ({
        name: formatDate.transform(updatedAt, 'MMM-dd, h:mm'),
        value: score?.[scoreType] || 0,
      }));
  }

  transform(value: ProjectBranch[], ...args: unknown[]) {
    const scoreLabelFormater = new LHScoreLabelFormaterPipe();
    const scores = [
      'pwa',
      'accessibility',
      'seo',
      'bestPractices',
      'performance',
    ];

    return scores
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((scoreType) => ({
        name: scoreLabelFormater.transform(scoreType),
        series: this.parseTimeLineForAScoreType(scoreType, value),
      }));
  }
}
