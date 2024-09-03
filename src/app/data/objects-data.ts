
const defaultUrl = '../../../assets/icon-objects/';
const noIcon = 'add_circle.png';

export const objects = [
  {
    id: 1,
    type: 'Вел. побутова техніка',
    object: [
      { id: 0, name: 'Холодильник', iconUrl: defaultUrl + "kitchen.png" },
      { id: 1, name: 'Пилосос', iconUrl: defaultUrl + noIcon },
      { id: 2, name: 'Пральна машина', iconUrl: defaultUrl + "dishwasher_gen.png"},
      { id: 3, name: 'Посудомийна машина', iconUrl: defaultUrl + "dishwasher_gen.png"},
      { id: 4, name: 'Мікрохвильовка', iconUrl: defaultUrl + "microwave.png"},
      { id: 5, name: 'Ел. варильна поверхня', iconUrl: defaultUrl + "cooking.png"},
      { id: 6, name: 'Газова варильна поверхня', iconUrl: defaultUrl + "oven_gen.png"},
      { id: 7, name: 'Духовка', iconUrl: defaultUrl + "microwave_gen.png"},
      { id: 8, name: 'Витяжка', iconUrl: defaultUrl + "range_hood.png"},
      { id: 9, name: 'Комб. варильна поверхня', iconUrl: defaultUrl + "cooking.png"},
      { id: 10, name: 'Телевізор', iconUrl: defaultUrl + "tv_gen.png"},
      { id: 11, name: 'Смарт тв', iconUrl: defaultUrl + "tv_with_assistant.png"},
    ]
  },

  {
    id: 2,
    type: 'Мал. побутова техніка',
    object: [
      { id: 0, name: 'Блендер', iconUrl: defaultUrl + "blender.png" },
      { id: 1, name: 'Кавомашина', iconUrl: defaultUrl + "coffee_maker.png" },
      { id: 2, name: 'Праска', iconUrl: defaultUrl + "iron.png"},
      { id: 3, name: 'Електрочайник', iconUrl: defaultUrl + "kettle.png"},
    ]
  },

  {
    id: 3,
    type: 'Кліматична техніка',
    object: [
      { id: 0, name: 'Кондиціонер', iconUrl: defaultUrl + "air_purifier.png"},
      { id: 1, name: 'Вентилятор', iconUrl: defaultUrl + "airware.png"},
      { id: 2, name: 'Бойлер', iconUrl: defaultUrl + "water_heater.png"},
      { id: 3, name: 'Очищувач повітря', iconUrl: defaultUrl + noIcon},
      { id: 4, name: 'Зволожувач повітря', iconUrl: defaultUrl + "air_freshener.png"},
      { id: 5, name: 'Осушувач повітря', iconUrl: defaultUrl + "air_freshener.png"},
      { id: 6, name: 'Конвектор', iconUrl: defaultUrl + "air_purifier.png"},
      { id: 7, name: 'Інфр. обігрівач', iconUrl: defaultUrl + noIcon},
      { id: 8, name: 'Оливні радіатори', iconUrl: defaultUrl + noIcon},
      { id: 9, name: 'Тепловентилятори', iconUrl: defaultUrl + noIcon},
    ]
  },

  {
    id: 4,
    type: 'Меблі',
    object: [
      { id: 0, name: 'Крісло', iconUrl: defaultUrl + "chair.png"},
      { id: 1, name: "Комп. стіл", iconUrl: defaultUrl + "desk.png"},
      { id: 2, name: 'Стілець', iconUrl: defaultUrl + "chair_alt.png"},
      { id: 3, name: 'Табурет', iconUrl: defaultUrl + noIcon},
      { id: 4, name: 'Безкаркасні меблі', iconUrl: defaultUrl + noIcon},
      { id: 5, name: 'Ліжко', iconUrl: defaultUrl + "bed.png"},
      { id: 6, name: 'Кухоний стіл', iconUrl: defaultUrl + "table_restaurant.png"},
      { id: 7, name: 'Кухоний куток', iconUrl: defaultUrl + noIcon},
      { id: 8, name: 'Шафа кухонна', iconUrl: defaultUrl + "vertical_shades.png"},
      { id: 9, name: 'Шафа для одягу', iconUrl: defaultUrl + "door_sliding.png"},
      { id: 10, name: 'Шафа', iconUrl: defaultUrl + "dresser.png"},
      { id: 11, name: 'Велике ліжко', iconUrl: defaultUrl + "king_bed.png"},
      { id: 12, name: 'Диван', iconUrl: defaultUrl + "weekend.png"},
      { id: 13, name: 'Полиці', iconUrl: defaultUrl + "shelves.png"},
      { id: 14, name: 'Кухонна стінка', iconUrl: defaultUrl + "countertops.png"},
      { id: 15, name: 'Раковина', iconUrl: defaultUrl + "faucet.png"},
      { id: 16, name: 'Розкладий диван', iconUrl: defaultUrl + "weekend.png"},
    ]
  },

  {
    id: 5,
    type: 'Ванна кімната',
    object: [
      { id: 0, name: 'Душ', iconUrl: defaultUrl + "shower.png"},
      { id: 1, name: "Ванна", iconUrl: defaultUrl + "bathtub.png"},
      { id: 2, name: 'Раковина', iconUrl: defaultUrl + "faucet.png"},
    ]
  },

  {
    id: 6,
    type: 'Лічильники',
    object: [
      { id: 0, name: 'Електрика', iconUrl: defaultUrl + "electric_meter.png"},
      { id: 1, name: "Холодна вода", iconUrl: defaultUrl + "humidity_high.png"},
      { id: 2, name: 'Водовідведення', iconUrl: defaultUrl + "valve.png"},
      { id: 3, name: 'Газ', iconUrl: defaultUrl + "gas_meter.png"},
      { id: 4, name: 'Гаряча вода', iconUrl: defaultUrl + "gas_meter.png"},
    ]
  },
]
