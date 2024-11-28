import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 5, suffix: string = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + suffix : value;
  }

}
