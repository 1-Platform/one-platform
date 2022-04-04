import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getDecimal'
})
export class GetDecimalPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return (value + "").split(".")[1];
  }

}
