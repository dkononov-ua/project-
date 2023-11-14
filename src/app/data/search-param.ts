// розшифровка значень з серверу
export const purpose: { [key: number]: string } = {
  0: 'Переїзд',
  1: 'Відряджання',
  2: 'Подорож',
  3: 'Навчання',
  4: 'Особисті причини',
};

export const aboutDistance: { [key: number]: string } = {
  0: 'Немає',
  1: 'На території',
  100: '100м',
  300: '300м',
  500: '500м',
  1000: '1км',
};

export const option_pay: { [key: number]: string } = {
  0: 'Щомісяця',
  1: 'Подобово',
};

export const animals: { [key: number]: string } = {
  0: 'Без тварин',
  1: 'З тваринами',
  2: 'Тільки котики',
  3: 'Тільки песики',
};

export const options: { [key: number]: string } = {
  0: 'Вибір не зроблено',
  1: 'Новий',
  2: 'Добрий',
  3: 'Задовільний',
  4: 'Поганий',
  5: 'Класичний балкон',
  6: 'Французький балкон',
  7: 'Лоджія',
  8: 'Тераса',
  9: 'Веранда',
}

export const checkBox: { [key: number]: string } = {
  0: 'Вибір не зроблено',
  1: 'Так',
  2: 'Ні',
}
