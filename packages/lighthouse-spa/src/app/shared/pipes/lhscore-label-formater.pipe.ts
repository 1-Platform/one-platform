import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lHScoreLabelFormater',
})
export class LHScoreLabelFormaterPipe implements PipeTransform {
  labelFormater = {
    pwa: 'PWA',
    bestPractices: 'Best Practices',
    accessibility: 'Accessibility',
    seo: 'SEO',
    performance: 'Performance',
  };
  constructor() {}
  transform(value: string, ...args: unknown[]): string {
    if (this.labelFormater?.[value]) {
      return this.labelFormater?.[value];
    }
    return value;
  }
}
