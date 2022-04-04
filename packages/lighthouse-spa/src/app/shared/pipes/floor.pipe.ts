import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floor',
})
export class FloorPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'number') return value;
    return Math.floor(value);
  }
}
