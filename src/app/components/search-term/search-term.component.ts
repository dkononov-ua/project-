import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss']
})
export class SearchTermComponent implements OnInit {

  minValue: number = 0;
  maxValue: number = 100000;

  selectedMinValue: number = 0;
  selectedMaxValue: number = 100000;

  onPriceRangeChange() {
    if (this.selectedMaxValue < this.selectedMinValue) {
      // Якщо максимальне значення менше за мінімальне, то змінюємо місцями ці значення
      const temp = this.selectedMinValue;
      this.selectedMinValue = this.selectedMaxValue;
      this.selectedMaxValue = temp;
    }
  }


  selectedCity!: number;
  selectedRooms!: number;
  selectedRating!: number;
  selectedArea!: number;
  selectedRegion!: number;

  regions = [
    { id: 0, name: 'Всі області' },
    { id: 1, name: 'Вінницька' },
    { id: 2, name: 'Волинська' },
    { id: 3, name: 'Дніпропетровська' },
    { id: 4, name: 'Донецька' },
    { id: 5, name: 'Житомирська' },
    { id: 6, name: 'Закарпатська' },
    { id: 7, name: 'Запорізька' },
    { id: 8, name: 'Івано-Франківська' },
    { id: 9, name: 'Київська' },
    { id: 10, name: 'Кіровоградська' },
    { id: 11, name: 'Луганська' },
    { id: 12, name: 'Львівська' },
    { id: 13, name: 'Миколаївська' },
    { id: 14, name: 'Одеська' },
    { id: 15, name: 'Полтавська' },
    { id: 16, name: 'Рівненська' },
    { id: 17, name: 'Сумська' },
    { id: 18, name: 'Тернопільська' },
    { id: 19, name: 'Харківська' },
    { id: 20, name: 'Херсонська' },
    { id: 21, name: 'Хмельницька' },
    { id: 22, name: 'Черкаська' },
    { id: 23, name: 'Чернівецька' },
    { id: 24, name: 'Чернігівська' },
    { id: 25, name: 'АР Крим' }
  ];

  cities = [
    { id: 0, name: 'Всі області' },
    { id: 1, name: 'Вінниця' },
    { id: 2, name: 'Луцьк' },
    { id: 3, name: 'Дніпро' },
    { id: 4, name: 'Донецьк' },
    { id: 5, name: 'Житомир' },
    { id: 6, name: 'Ужгород' },
    { id: 7, name: 'Запоріжжя' },
    { id: 8, name: 'Івано-Франківськ' },
    { id: 9, name: 'Київ' },
    { id: 10, name: 'Кропивницький' },
    { id: 11, name: 'Луганськ' },
    { id: 12, name: 'Львів' },
    { id: 13, name: 'Миколаїв' },
    { id: 14, name: 'Одеса' },
    { id: 15, name: 'Полтава' },
    { id: 16, name: 'Рівне' },
    { id: 17, name: 'Суми' },
    { id: 18, name: 'Тернопіль' },
    { id: 19, name: 'Харків' },
    { id: 20, name: 'Херсон' },
    { id: 21, name: 'Хмельницьк' },
    { id: 22, name: 'Черкаси' },
    { id: 23, name: 'Чернівці' },
    { id: 24, name: 'Чернігів' },
    { id: 25, name: 'АР Крим' }
  ];

  ngOnInit(): void {
  }
}
