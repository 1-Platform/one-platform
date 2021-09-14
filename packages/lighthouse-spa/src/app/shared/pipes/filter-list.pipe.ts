import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList',
})
export class FilterListPipe implements PipeTransform {
  transform<T extends any[]>(
    toBeFilteredArray: T,
    searchElement: string | number,
    key?: string
  ): T {
    switch (typeof toBeFilteredArray[0]) {
      case 'object': {
        return toBeFilteredArray.filter((el) =>
          el[key].includes(searchElement)
        ) as T;
      }
      case 'string': {
        return toBeFilteredArray.filter((el: T) =>
          el.includes(searchElement)
        ) as T;
      }
      case 'number': {
        return toBeFilteredArray.filter((el) => el === searchElement) as T;
      }
      default: {
        return toBeFilteredArray;
      }
    }
  }
}
