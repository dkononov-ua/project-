import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(cities: any[], searchText: string): any[] {
    if (!cities || !searchText) {
      return cities;
    }

    searchText = searchText.toLowerCase();
    return cities.filter(city => city.name.toLowerCase().includes(searchText));
  }
}
