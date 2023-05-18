export const regions = [
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

export const cities = [
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
  { id: 25, name: 'АР Крим' },
  { id: 26, name: 'Крюківщина' },
];

// Сортуємо міста за алфавітом
cities.sort((a, b) => a.name.localeCompare(b.name));

// Переприсвоюємо id по порядку
cities.forEach((city, index) => {
  city.id = index + 1;
});

// Сортуємо області за алфавітом
regions.sort((a, b) => a.name.localeCompare(b.name));

// Переприсвоюємо id по порядку
regions.forEach((region, index) => {
  region.id = index + 1;
});
