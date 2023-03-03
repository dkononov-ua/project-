import { Component } from '@angular/core';

@Component({
  selector: 'app-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss']
})
export class SearchTermComponent {}

//   handleSearchInput() {
//     const searchText: HTMLInputElement | null = document.querySelector('.form-control');
//     const searchValue: string = searchText?.value || '';

//     // Отримати список вибраних фільтрів
//     const filtersInput: HTMLInputElement[] = document.querySelectorAll('.form-check-input:checked');
//     const selectedFilters: string[] = Array.from(filtersInput).map((filter: HTMLInputElement) => filter.value);

//     // Виконати фільтрацію даних та повернути результат
//     const filteredData = this.data.filter((item) => {
//       // Фільтрувати за текстовим пошуком
//       if (searchValue && !item.name.toLowerCase().includes(searchValue.toLowerCase())) {
//         return false;
//       }

//       // Фільтрувати за вибраними фільтрами
//       if (selectedFilters.length && !selectedFilters.includes(item.category)) {
//         return false;
//       }

//       return true;
//     });

//     return filteredData;
//   }

//   // Мокап даних для прикладу
//   data = [
//     { name: 'Item 1', category: 'Category A' },
//     { name: 'Item 2', category: 'Category B' },
//     { name: 'Item 3', category: 'Category A' },
//     { name: 'Item 4', category: 'Category C' },
//     { name: 'Item 5', category: 'Category B' },
//   ];
// }
