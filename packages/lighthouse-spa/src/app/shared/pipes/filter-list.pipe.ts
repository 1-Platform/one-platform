import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList',
})
export class FilterListPipe implements PipeTransform {
  transform<T extends any[]>(
    toBeFilteredArray: T,
    searchElement: string,
    key?: string
  ): T {
    const search = searchElement.toLowerCase();
    switch (typeof toBeFilteredArray[0]) {
      case 'object': {
        return toBeFilteredArray.filter((el) => el[key].toLowerCase().includes(search)) as T;
      }
      case 'string': {
        return toBeFilteredArray.filter((el: string) => el.toLowerCase().includes(search)) as T;
      }
      case 'number': {
        return toBeFilteredArray.filter((el) => el === search) as T;
      }
      default: {
        return toBeFilteredArray;
      }
    }
  }
}
