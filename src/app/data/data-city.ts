export const country = [
  { id: 1, name: 'Україна' },
]

export const regions = [
  {
    id: 1,
    name: 'АР Крим',
    cities: [
      { id: 0, name: 'Алупка', postalCode: '98676' },
      { id: 1, name: 'Алушта', postalCode: '98500' },
      { id: 2, name: 'Армянськ', postalCode: '96012' },
      { id: 3, name: 'Бахчисарай', postalCode: '98400' },
      { id: 4, name: 'Білогірськ', postalCode: '97600' },
      { id: 5, name: 'Джанкой', postalCode: '96100' },
      { id: 6, name: 'Євпаторія', postalCode: '97400' },
      { id: 7, name: 'Інкерман', postalCode: '99703' },
      { id: 8, name: 'Керч', postalCode: '98300' },
      { id: 9, name: 'Красноперекопськ', postalCode: '96000' },
      { id: 10, name: 'Саки', postalCode: '96500' },
      {
        id: 11, name: 'Сімферополь', postalCode: '95000',
        district: [
          { id: 1, district: 'Залізничний' },
          { id: 2, district: 'Київський' },
          { id: 3, district: 'Центральний' },
        ]

      },
      { id: 12, name: 'Старий Крим', postalCode: '97345' },
      { id: 13, name: 'Судак', postalCode: '98000' },
      { id: 14, name: 'Феодосія', postalCode: '98100' },
      { id: 15, name: 'Щолкіне', postalCode: '98213' },
      { id: 16, name: 'Ялта', postalCode: '98600' },
    ]
  },
  {
    id: 2,
    name: 'Вінницька',
    cities: [
      {
        id: 0, name: 'Вінниця', postalCode: '21000',
        district: [
          { id: 1, district: 'Замостянський' },
          { id: 2, district: 'Ленінський' },
          { id: 3, district: 'Староміський' },
        ]

      },
      { id: 1, name: 'Могилів-Подільський', postalCode: '24000' },
      { id: 2, name: 'Бар', postalCode: '23000' },
      { id: 3, name: 'Гайсин', postalCode: '23700' },
      { id: 4, name: 'Бершадь', postalCode: '24400' },
      { id: 5, name: 'Хмільник', postalCode: '22000' },
      { id: 6, name: 'Калинівка', postalCode: '22400' },
      { id: 7, name: 'Тульчин', postalCode: '23600' },
      { id: 8, name: 'Козятин', postalCode: '22100' },
      { id: 9, name: 'Ладижин', postalCode: '24320' },
      { id: 10, name: 'Жмеринка', postalCode: '23100' },
      { id: 11, name: 'Іллінці', postalCode: '22700' },
      { id: 12, name: 'Немирів', postalCode: '22800' },
      { id: 13, name: 'Ямпіль', postalCode: '24500' },
      { id: 14, name: 'Погребище', postalCode: '22200' },
      { id: 15, name: 'Гнівань', postalCode: '23310' },
      { id: 16, name: 'Липовець', postalCode: '22500' },
      { id: 17, name: 'Шаргород', postalCode: '23500' },
    ]
  },
  {
    id: 3,
    name: 'Волинська',
    cities: [
      { id: 0, name: 'Берестечко', postalCode: '45765' },
      { id: 1, name: 'Володимир-Волинський', postalCode: '44700' },
      { id: 2, name: 'Горохів', postalCode: '45700' },
      { id: 3, name: 'Камінь-Каширський', postalCode: '44500' },
      { id: 4, name: 'Ківерці', postalCode: '45200' },
      { id: 5, name: 'Ковель', postalCode: '45000' },
      {
        id: 6, name: 'Луцьк', postalCode: '43000',
        district: [
          { id: 1, district: 'Привокзальний' },
          { id: 2, district: 'Центральний' },
        ]

      },
      { id: 7, name: 'Любомль', postalCode: '44300' },
      { id: 8, name: 'Нововолинськ', postalCode: '45400' },
      { id: 9, name: 'Рожище', postalCode: '45100' },
      { id: 10, name: 'Устилуг', postalCode: '44731' },
    ]
  },
  {
    id: 4,
    name: 'Дніпропетровська',
    cities: [
      { id: 0, name: 'Апостолове', postalCode: '53800' },
      { id: 1, name: 'Верхівцеве', postalCode: '51660' },
      { id: 2, name: 'Верхньодніпровськ', postalCode: '51600' },
      { id: 3, name: 'Вільногірськ', postalCode: '51700' },
      {
        id: 4,
        name: 'Дніпро',
        postalCode: '49000',
        district: [
          { id: 1, district: 'Амур-Нижньодніпровський' },
          { id: 2, district: 'Бабушкінський' },
          { id: 3, district: 'Верхньодніпровський' },
          { id: 4, district: 'Індустріальний' },
          { id: 5, district: 'Кіровський' },
          { id: 6, district: 'Ленінський' },
          { id: 7, district: 'Самарський' },
          { id: 8, district: 'Центральний' },
          { id: 9, district: 'Шевченківський' }
        ]
      },
      { id: 5, name: 'Жовті Води', postalCode: '52290' },
      { id: 6, name: 'Зеленодольськ', postalCode: '53860' },
      { id: 7, name: 'Кам’янське', postalCode: '51900' },
      {
        id: 8, name: 'Кривий Ріг', postalCode: '50000',
        district: [
          { id: 1, district: 'Центрально-Міський' },
          { id: 2, district: 'Дзержинський' },
          { id: 3, district: 'Інгулецький' },
          { id: 4, district: 'Саксаганський' },
          { id: 5, district: 'Тернівський' },
          { id: 6, district: 'Жовтневий' }
        ]

      },
      { id: 9, name: 'Марганець', postalCode: '53400' },
      { id: 10, name: 'Нікополь', postalCode: '53200' },
      { id: 11, name: 'Новомосковськ', postalCode: '51214' },
      { id: 12, name: 'П’ятихатки', postalCode: '52100' },
      { id: 13, name: 'Павлоград', postalCode: '51400' },
      { id: 14, name: 'Перещепине', postalCode: '51220' },
      { id: 15, name: 'Першотравенськ', postalCode: '52800' },
      { id: 16, name: 'Підгородне', postalCode: '52001' },
      { id: 17, name: 'Покров', postalCode: '53300' },
      { id: 18, name: 'Синельникове', postalCode: '52500' },
      { id: 19, name: 'Тернівка', postalCode: '51500' },
    ]
  },
  {
    id: 5,
    name: 'Донецька',
    cities: [
      { id: 0, name: 'Авдіївка', postalCode: '86060' },
      { id: 1, name: 'Амвросіївка', postalCode: '87300' },
      { id: 2, name: 'Бахмут', postalCode: '84500' },
      { id: 3, name: 'Білицьке', postalCode: '85040' },
      { id: 4, name: 'Білозерське', postalCode: '85012' },
      { id: 5, name: 'Бунге', postalCode: '86493' },
      { id: 6, name: 'Волноваха', postalCode: '85700' },
      { id: 7, name: 'Вуглегірськ', postalCode: '86481' },
      { id: 8, name: 'Вугледар', postalCode: '85670' },
      { id: 9, name: 'Гірник', postalCode: '85487' },
      { id: 10, name: 'Горлівка', postalCode: '84600' },
      { id: 11, name: 'Дебальцеве', postalCode: '84700' },
      { id: 12, name: 'Добропілля', postalCode: '85000' },
      { id: 13, name: 'Докучаєвськ', postalCode: '85740' },
      { id: 14, name: 'Донецьк', postalCode: '83000' },
      { id: 15, name: 'Дружківка', postalCode: '84200' },
      { id: 16, name: 'Єнакієве', postalCode: '86400' },
      { id: 17, name: 'Жданівка', postalCode: '86391' },
      { id: 18, name: 'Залізне', postalCode: '85290' },
      { id: 19, name: 'Зугрес', postalCode: '86783' },
      { id: 20, name: 'Іловайськ', postalCode: '86793' },
      { id: 21, name: 'Кальміуське', postalCode: '87250' },
      { id: 22, name: 'Костянтинівка', postalCode: '85100' },
      { id: 23, name: 'Краматорськ', postalCode: '84300' },
      { id: 24, name: 'Красногорівка', postalCode: '8563' },
      { id: 25, name: 'Курахове', postalCode: '85612' },
      { id: 26, name: 'Лиман', postalCode: '84400' },
      { id: 27, name: 'Макіївка', postalCode: '86100' },
      { id: 28, name: 'Мар’їнка', postalCode: '85600' },
      { id: 29, name: 'Маріуполь', postalCode: '87500' },
      { id: 30, name: 'Миколаївка', postalCode: '84180' },
      { id: 31, name: 'Мирноград', postalCode: '85320' },
      { id: 32, name: 'Моспине', postalCode: '83492' },
      { id: 33, name: 'Новоазовськ', postalCode: '87600' },
      { id: 34, name: 'Новогродівка', postalCode: '85483' },
      { id: 35, name: 'Покровськ', postalCode: '85300' },
      { id: 36, name: 'Родинське', postalCode: '85310' },
      { id: 37, name: 'Світлодарськ', postalCode: '84792' },
      { id: 38, name: 'Святогірськ', postalCode: '84130' },
      { id: 39, name: 'Селидове', postalCode: '85400' },
      { id: 40, name: 'Сіверськ', postalCode: '84522' },
      { id: 41, name: 'Слов’янськ', postalCode: '84100' },
      { id: 42, name: 'Сніжне', postalCode: '86500' },
      { id: 43, name: 'Соледар', postalCode: '84545' },
      { id: 44, name: 'Торецьк', postalCode: '85200' },
      { id: 45, name: 'Українськ', postalCode: '85485' },
      { id: 46, name: 'Харцизьк', postalCode: '86700' },
      { id: 47, name: 'Хрестівка', postalCode: '86300' },
      { id: 48, name: 'Часів Яр', postalCode: '84551' },
      { id: 49, name: 'Чистякове', postalCode: '86600' },
      { id: 50, name: 'Шахтарськ', postalCode: '86200' },
      { id: 51, name: 'Ясинувата', postalCode: '86000' },
    ]
  },
  {
    id: 6,
    name: 'Житомирська',
    cities: [
      { id: 0, name: 'Андрушівка', postalCode: '13405' },
      { id: 1, name: 'Баранівка', postalCode: '12705' },
      { id: 2, name: 'Бердичів', postalCode: '13300' },
      {
        id: 3, name: 'Житомир', postalCode: '10499',
        district: [
          { id: 1, district: 'Богунський' },
          { id: 2, district: 'Корольовський' },
        ]

      },
      { id: 4, name: 'Звягель', postalCode: '11709' },
      { id: 5, name: 'Коростень', postalCode: '11500' },
      { id: 6, name: 'Коростишів', postalCode: '12509' },
      { id: 7, name: 'Малин', postalCode: '11605' },
      { id: 8, name: 'Овруч', postalCode: '11109' },
      { id: 9, name: 'Олевськ', postalCode: '11005' },
      { id: 10, name: 'Радомишль', postalCode: '12200' },
      { id: 11, name: 'Чуднів', postalCode: '13205' }
    ]
  },
  {
    id: 7,
    name: 'Закарпатська',
    cities: [
      { id: 0, name: 'Берегове', postalCode: '90200' },
      { id: 1, name: 'Виноградів', postalCode: '90300' },
      { id: 2, name: 'Іршава', postalCode: '90100' },
      { id: 3, name: 'Мукачево', postalCode: '89600' },
      { id: 4, name: 'Перечин', postalCode: '89200' },
      { id: 5, name: 'Рахів', postalCode: '90600' },
      { id: 6, name: 'Свалява', postalCode: '89300' },
      { id: 7, name: 'Тячів', postalCode: '90500' },
      {
        id: 8, name: 'Ужгород', postalCode: '88000',
        district: [
          { id: 1, district: 'Центральний' },
          { id: 2, district: 'Боздоський' },
        ]

      },
      { id: 9, name: 'Хуст', postalCode: '90400' },
      { id: 10, name: 'Чоп', postalCode: '89500' }
    ]
  },
  {
    id: 8,
    name: 'Запорізька',
    cities: [
      { id: 0, name: 'Бердянськ', postalCode: '71127' },
      { id: 1, name: 'Василівка', postalCode: '71602' },
      { id: 2, name: 'Вільнянськ', postalCode: '70000' },
      { id: 3, name: 'Гуляйполе', postalCode: '70205' },
      { id: 4, name: 'Дніпрорудне', postalCode: '71634' },
      { id: 5, name: 'Енергодар', postalCode: '71599' },
      {
        id: 6, name: 'Запоріжжя', postalCode: '69061',
        district: [
          { id: 1, district: 'Дніпровський' },
          { id: 2, district: 'Комунарський' },
          { id: 3, district: 'Олександрівський' },
          { id: 4, district: 'Заводський' },
          { id: 5, district: 'Шевченківський' },
        ]

      },
      { id: 7, name: 'Кам’янка-Дніпровська', postalCode: '71309' },
      { id: 8, name: 'Мелітополь', postalCode: '72301' },
      { id: 9, name: 'Молочанськ', postalCode: '71717' },
      { id: 10, name: 'Оріхів', postalCode: '70500' },
      { id: 11, name: 'Пологи', postalCode: '70614' },
      { id: 12, name: 'Приморськ', postalCode: '72102' },
      { id: 13, name: 'Токмак', postalCode: '71715' }
    ]
  },
  {
    id: 9,
    name: 'Івано-Франківська',
    cities: [
      { id: 0, name: 'Болехів', postalCode: '77200' },
      { id: 1, name: 'Бурштин', postalCode: '77111' },
      { id: 2, name: 'Галич', postalCode: '77104' },
      { id: 3, name: 'Городенка', postalCode: '78100' },
      { id: 4, name: 'Долина', postalCode: '77508' },
      {
        id: 5, name: 'Івано-Франківськ', postalCode: '76002',
        district: [
          { id: 1, district: 'Центральний' },
          { id: 2, district: 'Міський' },
        ]

      },
      { id: 6, name: 'Калуш', postalCode: '77300' },
      { id: 7, name: 'Коломия', postalCode: '78212' },
      { id: 8, name: 'Косів', postalCode: '78600' },
      { id: 9, name: 'Надвірна', postalCode: '78400' },
      { id: 10, name: 'Рогатин', postalCode: '77004' },
      { id: 11, name: 'Снятин', postalCode: '78300' },
      { id: 12, name: 'Тисмениця', postalCode: '77404' },
      { id: 13, name: 'Тлумач', postalCode: '78000' },
      { id: 14, name: 'Яремче', postalCode: '78500' }
    ]
  },
  {
    id: 10,
    name: 'Київська',
    cities: [
      { id: 0, name: 'Баришівка', postalCode: '07500' },
      { id: 1, name: 'Березань', postalCode: '07543' },
      { id: 2, name: 'Біла Церква', postalCode: '09103' },
      { id: 3, name: 'Богуслав', postalCode: '09700' },
      { id: 4, name: 'Бориспіль', postalCode: '08318' },
      { id: 5, name: 'Бородянка', postalCode: '07800' },
      { id: 6, name: 'Боярка', postalCode: '08157' },
      { id: 7, name: 'Бровари', postalCode: '07400' },
      { id: 8, name: 'Буча', postalCode: '08295' },
      { id: 9, name: 'Васильків', postalCode: '08612' },
      { id: 10, name: 'Велика Димерка', postalCode: '07442' },
      { id: 11, name: 'Вишгород', postalCode: '07304' },
      { id: 12, name: 'Вишневе', postalCode: '08134' },
      { id: 13, name: 'Глеваха', postalCode: '08630' },
      { id: 14, name: 'Гостомель', postalCode: '08291' },
      { id: 15, name: 'Іванків', postalCode: '07200' },
      { id: 16, name: 'Ірпінь', postalCode: '08289' },
      { id: 17, name: 'Кагарлик', postalCode: '09205' },
      { id: 18, name: 'Коцюбинське', postalCode: '08299' },
      { id: 19, name: 'Крюківщина', postalCode: '08136' },
      { id: 20, name: 'Макарів', postalCode: '08002' },
      { id: 21, name: 'Миронівка', postalCode: '08804' },
      { id: 22, name: 'Обухів', postalCode: '08705' },
      { id: 23, name: 'Переяслав', postalCode: '08409' },
      { id: 24, name: 'Ржищів', postalCode: '09231' },
      { id: 25, name: 'Рокитне', postalCode: '09600' },
      { id: 26, name: 'Сквира', postalCode: '09003' },
      { id: 27, name: 'Славутич', postalCode: '07199' },
      { id: 28, name: 'Ставище', postalCode: '09400' },
      { id: 29, name: 'Тараща', postalCode: '09504' },
      { id: 30, name: 'Тетіїв', postalCode: '09804' },
      { id: 31, name: 'Узин', postalCode: '09163' },
      { id: 32, name: 'Українка', postalCode: '08721' },
      { id: 33, name: 'Фастів', postalCode: '08509' },
      { id: 34, name: 'Яготин', postalCode: '07700' },
      {
        id: 35,
        name: 'Київ',
        postalCode: '01001',
        district: [
          { id: 1, district: 'Деснянський' },
          { id: 2, district: 'Шевченківський' },
          { id: 3, district: 'Подільський' },
          { id: 4, district: 'Оболонський' },
          { id: 5, district: 'Дніпровський' },
          { id: 6, district: 'Дарницький' },
          { id: 7, district: 'Святошинський' },
          { id: 8, district: 'Печерський' },
          { id: 9, district: 'Голосіївський' },
          { id: 10, district: "Солом'янський" },
        ]
      },
    ]
  },
  {
    id: 11,
    name: 'Кіровоградська',
    cities: [
      { id: 0, name: 'Благовіщенське', postalCode: '26400' },
      { id: 1, name: 'Бобринець', postalCode: '27200' },
      { id: 2, name: 'Гайворон', postalCode: '26312' },
      { id: 3, name: 'Долинська', postalCode: '28500' },
      { id: 4, name: 'Знам’янка', postalCode: '27400' },
      {
        id: 5, name: 'Кропивницький', postalCode: '25000',
        district: [
          { id: 1, district: 'Фортечний' },
          { id: 2, district: 'Подільський' },
        ]
      },
      { id: 6, name: 'Мала Виска', postalCode: '26200' },
      { id: 7, name: 'Новомиргород', postalCode: '26000' },
      { id: 8, name: 'Новоукраїнка', postalCode: '27100' },
      { id: 9, name: 'Олександрія', postalCode: '28000' },
      { id: 10, name: 'Помічна', postalCode: '27030' },
      { id: 11, name: 'Світловодськ', postalCode: '27500' }
    ]
  },
  {
    id: 12,
    name: 'Луганська',
    cities: [
      { id: 0, name: 'Алмазна', postalCode: '94097' },
      { id: 1, name: 'Алчевськ', postalCode: '94200' },
      { id: 2, name: 'Антрацит', postalCode: '94600' },
      { id: 3, name: 'Боково-Хрустальне', postalCode: '94565' },
      { id: 4, name: 'Брянка', postalCode: '94190' },
      { id: 5, name: 'Вознесенівка', postalCode: '94834' },
      { id: 6, name: 'Гірське', postalCode: '93292' },
      { id: 7, name: 'Голубівка', postalCode: '93889' },
      { id: 8, name: 'Довжанськ', postalCode: '94819' },
      { id: 9, name: 'Зимогір’я', postalCode: '93742' },
      { id: 10, name: 'Золоте', postalCode: '93294' },
      { id: 11, name: 'Зоринськ', postalCode: '94323' },
      { id: 12, name: 'Ірміно', postalCode: '94094' },
      { id: 13, name: 'Кадіївка', postalCode: '94090' },
      { id: 14, name: 'Кипуче', postalCode: '94315' },
      { id: 15, name: 'Кремінна', postalCode: '92905' },
      { id: 16, name: 'Лисичанськ', postalCode: '93190' },
      {
        id: 17, name: 'Луганськ', postalCode: '91000',
        district: [
          { id: 1, district: 'Кам’янобродський' },
          { id: 2, district: 'Жовтневий' },
          { id: 3, district: 'Ленінський' },
        ]

      },
      { id: 18, name: 'Лутугине', postalCode: '92000' },
      { id: 19, name: 'Міусинськ', postalCode: '94536' },
      { id: 20, name: 'Молодогвардійськ', postalCode: '94415' },
      { id: 21, name: 'Новодружеськ', postalCode: '93192' },
      { id: 22, name: 'Олександрівськ', postalCode: '91489' },
      { id: 23, name: 'Первомайськ', postalCode: '93200' },
      { id: 24, name: 'Перевальськ', postalCode: '94308' },
      { id: 25, name: 'Петрово-Красносілля', postalCode: '94546' },
      { id: 26, name: 'Попасна', postalCode: '93309' },
      { id: 27, name: 'Привілля', postalCode: '93192' },
      { id: 28, name: 'Ровеньки', postalCode: '94779' },
      { id: 29, name: 'Рубіжне', postalCode: '93099' },
      { id: 30, name: 'Сватове', postalCode: '92605' },
      { id: 31, name: 'Сєвєродонецьк', postalCode: '93480' },
      { id: 32, name: 'Сорокине', postalCode: '94400' },
      { id: 33, name: 'Старобільськ', postalCode: '92709' },
      { id: 34, name: 'Суходільськ', postalCode: '94420' },
      { id: 35, name: 'Хрустальний', postalCode: '94529' },
      { id: 36, name: 'Щастя', postalCode: '91483' }
    ]
  },
  {
    id: 13,
    name: 'Львівська',
    cities: [
      { id: 0, name: 'Белз', postalCode: '80065' },
      { id: 1, name: 'Бібрка', postalCode: '81221' },
      { id: 2, name: 'Борислав', postalCode: '82390' },
      { id: 3, name: 'Броди', postalCode: '80606' },
      { id: 4, name: 'Буськ', postalCode: '80505' },
      { id: 5, name: 'Великі Мости', postalCode: '80075' },
      { id: 6, name: 'Винники', postalCode: '79496' },
      { id: 7, name: 'Глиняни', postalCode: '80721' },
      { id: 8, name: 'Городок', postalCode: '81504' },
      { id: 9, name: 'Добромиль', postalCode: '82043' },
      { id: 10, name: 'Дрогобич', postalCode: '82119' },
      { id: 11, name: 'Дубляни', postalCode: '80381' },
      { id: 12, name: 'Жидачів', postalCode: '81704' },
      { id: 13, name: 'Жовква', postalCode: '80304' },
      { id: 14, name: 'Золочів', postalCode: '80703' },
      { id: 15, name: 'Кам’янка-Бузька', postalCode: '80404' },
      { id: 16, name: 'Комарно', postalCode: '81563' },
      {
        id: 17,
        name: 'Львів',
        postalCode: '79007',
        district: [
          { id: 1, district: 'Галицький' },
          { id: 2, district: 'Залізничний' },
          { id: 3, district: 'Личаківський' },
          { id: 4, district: 'Шевченківський' },
          { id: 5, district: 'Сихівський' },
          { id: 6, district: 'Франківський' }
        ]
      },
      // { id: 18, name: 'Миколаїв', postalCode: '81604', },
      { id: 19, name: 'Моршин', postalCode: '82482' },
      { id: 20, name: 'Мостиська', postalCode: '81300' },
      { id: 21, name: 'Новий Калинів', postalCode: '81464' },
      { id: 22, name: 'Новий Розділ', postalCode: '81655' },
      { id: 23, name: 'Новояворівськ', postalCode: '81054' },
      { id: 24, name: 'Перемишляни', postalCode: '81203' },
      { id: 25, name: 'Пустомити', postalCode: '81104' },
      { id: 26, name: 'Рава-Руська', postalCode: '80316' },
      { id: 27, name: 'Радехів', postalCode: '80203' },
      { id: 28, name: 'Рудки', postalCode: '81441' },
      { id: 29, name: 'Самбір', postalCode: '81412' },
      { id: 30, name: 'Сколе', postalCode: '82602' },
      { id: 31, name: 'Сокаль', postalCode: '80005' },
      { id: 32, name: 'Соснівка', postalCode: '80193' },
      { id: 33, name: 'Старий Самбір', postalCode: '82003' },
      { id: 34, name: 'Стебник', postalCode: '82175' },
      { id: 35, name: 'Стрий', postalCode: '82419' },
      { id: 36, name: 'Судова Вишня', postalCode: '81341' },
      { id: 37, name: 'Трускавець', postalCode: '82299' },
      { id: 38, name: 'Турка', postalCode: '82502' },
      { id: 39, name: 'Угнів', postalCode: '80065' },
      { id: 40, name: 'Хирів', postalCode: '82061' },
      { id: 41, name: 'Ходорів', postalCode: '81753' },
      { id: 42, name: 'Червоноград', postalCode: '80100' },
      { id: 43, name: 'Яворів', postalCode: '81005' }
    ]
  },
  {
    id: 14,
    name: 'Миколаївська',
    cities: [
      { id: 0, name: 'Баштанка', postalCode: '56109' },
      { id: 1, name: 'Вознесенськ', postalCode: '56518' },
      {
        id: 2, name: 'Миколаїв',
        postalCode: '327027',
        district: [
          { id: 1, district: 'Центральний' },
          { id: 2, district: 'Інгульський' },
          { id: 3, district: 'Заводський' },
          { id: 4, district: 'Корабельний' },
        ]
      },
      { id: 3, name: 'Нова Одеса', postalCode: '56608' },
      { id: 4, name: 'Новий Буг', postalCode: '55609' },
      { id: 5, name: 'Очаків', postalCode: '57514' },
      { id: 6, name: 'Первомайськ', postalCode: '55219' },
      { id: 7, name: 'Снігурівка', postalCode: '57309' },
      { id: 8, name: 'Южноукраїнськ', postalCode: '55099' }
    ]
  },
  {
    id: 15,
    name: 'Одеська',
    cities: [
      { id: 0, name: 'Ананьїв', postalCode: '66400' },
      { id: 1, name: 'Арциз', postalCode: '68409' },
      { id: 2, name: 'Балта', postalCode: '66105' },
      { id: 3, name: 'Березівка', postalCode: '67305' },
      { id: 4, name: 'Білгород-Дністровський', postalCode: '67719' },
      { id: 5, name: 'Біляївка', postalCode: '67604' },
      { id: 6, name: 'Болград', postalCode: '68706' },
      { id: 7, name: 'Вилкове', postalCode: '68355' },
      { id: 8, name: 'Ізмаїл', postalCode: '68633' },
      { id: 9, name: 'Кілія', postalCode: '68309' },
      { id: 10, name: 'Кодима', postalCode: '66003' },
      {
        id: 11,
        name: 'Одеса',
        postalCode: '65480',
        district: [
          { id: 1, district: 'Малиновський' },
          { id: 2, district: 'Приморський' },
          { id: 3, district: 'Київський' },
          { id: 4, district: 'Суворовський' },
          { id: 5, district: 'Комінтернівський' },
          { id: 6, district: 'Слобідський' }
        ]

      },
      { id: 12, name: 'Подільськ', postalCode: '66314' },
      { id: 13, name: 'Рені', postalCode: '68809' },
      { id: 14, name: 'Роздільна', postalCode: '67404' },
      { id: 15, name: 'Татарбунари', postalCode: '68104' },
      { id: 16, name: 'Теплодар', postalCode: '65480' },
      { id: 17, name: 'Чорноморськ', postalCode: '68090' },
      { id: 18, name: 'Южне', postalCode: '65481' }
    ]
  },
  {
    id: 16,
    name: 'Полтавська',
    cities: [
      { id: 0, name: 'Гадяч', postalCode: '37305' },
      { id: 1, name: 'Глобине', postalCode: '39006' },
      { id: 2, name: 'Горішні Плавні', postalCode: '39890' },
      { id: 3, name: 'Гребінка', postalCode: '37406' },
      { id: 4, name: 'Заводське', postalCode: '37240' },
      { id: 5, name: 'Зіньків', postalCode: '38104' },
      { id: 6, name: 'Карлівка', postalCode: '39507' },
      { id: 7, name: 'Кобеляки', postalCode: '39204' },
      { id: 8, name: 'Кременчук', postalCode: '39600' },
      { id: 9, name: 'Лохвиця', postalCode: '37204' },
      { id: 10, name: 'Лубни', postalCode: '37500' },
      { id: 11, name: 'Миргород', postalCode: '37609' },
      { id: 12, name: 'Пирятин', postalCode: '37004' },
      {
        id: 13, name: 'Полтава', postalCode: '36499',
        district: [
          { id: 1, district: 'Київський' },
          { id: 2, district: 'Подільський' },
          { id: 3, district: 'Шевченківський' },
        ]

      },
      { id: 14, name: 'Решетилівка', postalCode: '38402' },
      { id: 15, name: 'Хорол', postalCode: '37800' }
    ]
  },
  {
    id: 17,
    name: 'Рівненська',
    cities: [
      { id: 0, name: 'Березне', postalCode: '34600' },
      { id: 1, name: 'Вараш', postalCode: '34499' },
      { id: 2, name: 'Дубно', postalCode: '35608' },
      { id: 3, name: 'Дубровиця', postalCode: '34108' },
      { id: 4, name: 'Здолбунів', postalCode: '35706' },
      { id: 5, name: 'Корець', postalCode: '34700' },
      { id: 6, name: 'Костопіль', postalCode: '35008' },
      { id: 7, name: 'Острог', postalCode: '35800' },
      { id: 8, name: 'Радивилів', postalCode: '35500' },
      {
        id: 9, name: 'Рівне', postalCode: '33499',
        district: [
          { id: 1, district: 'Західний' },
          { id: 2, district: 'Північний' },
        ]
      },
      { id: 10, name: 'Сарни', postalCode: '34507' }
    ]
  },
  {
    id: 18,
    name: 'Сумська',
    cities: [
      { id: 0, name: 'Білопілля', postalCode: '41800' },
      { id: 1, name: 'Буринь', postalCode: '41700' },
      { id: 2, name: 'Ворожба', postalCode: '41811' },
      { id: 3, name: 'Глухів', postalCode: '41400' },
      { id: 4, name: 'Дружба', postalCode: '41220' },
      { id: 5, name: 'Конотоп', postalCode: '41600' },
      { id: 6, name: 'Кролевець', postalCode: '41300' },
      { id: 7, name: 'Лебедин', postalCode: '42200' },
      { id: 8, name: 'Охтирка', postalCode: '42700' },
      { id: 9, name: 'Путивль', postalCode: '41500' },
      { id: 10, name: 'Ромни', postalCode: '42000' },
      { id: 11, name: 'Середина-Буда', postalCode: '41000' },
      {
        id: 12, name: 'Суми', postalCode: '40004',
        district: [
          { id: 1, district: 'Ковпаківський' },
          { id: 2, district: 'Зарічний' },
        ]

      },
      { id: 13, name: 'Тростянець', postalCode: '42600' },
      { id: 14, name: 'Шостка', postalCode: '41100' }
    ]
  },
  {
    id: 19,
    name: 'Тернопільська',
    cities: [
      { id: 0, name: 'Бережани', postalCode: '47505' },
      { id: 1, name: 'Борщів', postalCode: '48700' },
      { id: 2, name: 'Бучач', postalCode: '48405' },
      { id: 3, name: 'Заліщики', postalCode: '48605' },
      { id: 4, name: 'Збараж', postalCode: '48410' },
      { id: 5, name: 'Зборів', postalCode: '47204' },
      { id: 6, name: 'Копичинці', postalCode: '48264' },
      { id: 7, name: 'Кременець', postalCode: '47000' },
      { id: 8, name: 'Ланівці', postalCode: '47400' },
      { id: 9, name: 'Монастириська', postalCode: '48305' },
      { id: 10, name: 'Підгайці', postalCode: '48005' },
      { id: 11, name: 'Почаїв', postalCode: '47027' },
      { id: 12, name: 'Скалат', postalCode: '47851' },
      { id: 13, name: 'Теребовля', postalCode: '48100' },
      {
        id: 14, name: 'Тернопіль', postalCode: '46000',
        district: [
          { id: 1, district: 'Східний' },
          { id: 2, district: 'Західний' },
          { id: 3, district: 'Південний' },
        ]

      },
      { id: 15, name: 'Хоростків', postalCode: '48244' },
      { id: 16, name: 'Чортків', postalCode: '48509' },
      { id: 17, name: 'Шумськ', postalCode: '47104' }
    ]
  },
  {
    id: 20,
    name: 'Харківська',
    cities: [
      { id: 0, name: 'Балаклія', postalCode: '64218' },
      { id: 1, name: 'Барвінкове', postalCode: '64709' },
      { id: 2, name: 'Богодухів', postalCode: '62109' },
      { id: 3, name: 'Валки', postalCode: '63000' },
      { id: 4, name: 'Вовчанськ', postalCode: '62507' },
      { id: 5, name: 'Дергачі', postalCode: '62309' },
      { id: 6, name: 'Зміїв', postalCode: '63409' },
      { id: 7, name: 'Ізюм', postalCode: '64318' },
      { id: 8, name: 'Красноград', postalCode: '63300' },
      { id: 9, name: 'Куп’янськ', postalCode: '63700' },
      { id: 10, name: 'Лозова', postalCode: '64609' },
      { id: 11, name: 'Люботин', postalCode: '62433' },
      { id: 12, name: 'Мерефа', postalCode: '62477' },
      { id: 13, name: 'Первомайський', postalCode: '64109' },
      { id: 14, name: 'Південне', postalCode: '62464' },
      {
        id: 15,
        name: 'Харків',
        postalCode: '61000',
        district: [
          { id: 1, district: 'Шевченківський' },
          { id: 2, district: 'Київський' },
          { id: 3, district: 'Московський' },
          { id: 4, district: 'Індустріальний' },
          { id: 5, district: "Основ'янський" },
          { id: 6, district: 'Слобідський' },
          { id: 7, district: 'Новобаварський' },
          { id: 8, district: 'Холодногірський' },
          { id: 9, district: 'Немишлянський' }
        ]
      },
      { id: 16, name: 'Чугуїв', postalCode: '63509' }
    ]
  },
  {
    id: 21,
    name: 'Херсонська',
    cities: [
      { id: 0, name: 'Берислав', postalCode: '74306' },
      { id: 1, name: 'Генічеськ', postalCode: '75509' },
      { id: 2, name: 'Гола Пристань', postalCode: '75604' },
      { id: 3, name: 'Каховка', postalCode: '74814' },
      { id: 4, name: 'Нова Каховка', postalCode: '74985' },
      { id: 5, name: 'Олешки', postalCode: '75108' },
      { id: 6, name: 'Скадовськ', postalCode: '75704' },
      { id: 7, name: 'Таврійськ', postalCode: '74989' },
      {
        id: 8, name: 'Херсон', postalCode: '73000',
        district: [
          { id: 1, district: 'Корабельний' },
          { id: 2, district: 'Дніпровський' },
          { id: 3, district: 'Суворовський' },
        ]

      }
    ]
  },
  {
    id: 22,
    name: 'Хмельницька',
    cities: [
      { id: 0, name: 'Волочиськ', postalCode: '31208' },
      { id: 1, name: 'Городок', postalCode: '32007' },
      { id: 2, name: 'Деражня', postalCode: '32200' },
      { id: 3, name: 'Дунаївці', postalCode: '32400' },
      { id: 4, name: 'Ізяслав', postalCode: '30309' },
      { id: 5, name: 'Кам’янець-Подільський', postalCode: '32318' },
      { id: 6, name: 'Красилів', postalCode: '31000' },
      { id: 7, name: 'Нетішин', postalCode: '30100' },
      { id: 8, name: 'Полонне', postalCode: '30509' },
      { id: 9, name: 'Славута', postalCode: '30000' },
      { id: 10, name: 'Старокостянтинів', postalCode: '31109' },
      {
        id: 11, name: 'Хмельницький', postalCode: '29000',
        district: [
          { id: 1, district: 'Заріччя' },
          { id: 2, district: 'Південний' },
        ]

      },
      { id: 12, name: 'Шепетівка', postalCode: '30409' }
    ]
  },
  {
    id: 23,
    name: 'Черкаська',
    cities: [
      { id: 0, name: 'Ватутіне', postalCode: '20254' },
      { id: 1, name: 'Городище', postalCode: '19507' },
      { id: 2, name: 'Жашків', postalCode: '19208' },
      { id: 3, name: 'Звенигородка', postalCode: '20207' },
      { id: 4, name: 'Золотоноша', postalCode: '19705' },
      { id: 5, name: 'Кам’янка', postalCode: '20809' },
      { id: 6, name: 'Канів', postalCode: '19009' },
      { id: 7, name: 'Корсунь-Шевченківський', postalCode: '19400' },
      { id: 8, name: 'Монастирище', postalCode: '19109' },
      { id: 9, name: 'Сміла', postalCode: '20700' },
      { id: 10, name: 'Тальне', postalCode: '20401' },
      { id: 11, name: 'Умань', postalCode: '20300' },
      { id: 12, name: 'Христинівка', postalCode: '20000' },
      {
        id: 13, name: 'Черкаси', postalCode: '18499',
        district: [
          { id: 1, district: 'Соснівський' },
          { id: 2, district: 'Придніпровський' },
        ]
      },
      { id: 14, name: 'Чигирин', postalCode: '20906' },
      { id: 15, name: 'Шпола', postalCode: '20600' }
    ]
  },
  {
    id: 24,
    name: 'Чернівецька',
    cities: [
      { id: 0, name: 'Вашківці', postalCode: '59210' },
      { id: 1, name: 'Вижниця', postalCode: '59200' },
      { id: 2, name: 'Герца', postalCode: '60500' },
      { id: 3, name: 'Заставна', postalCode: '59400' },
      { id: 4, name: 'Кіцмань', postalCode: '59300' },
      { id: 5, name: 'Новодністровськ', postalCode: '60236' },
      { id: 6, name: 'Новоселиця', postalCode: '60300' },
      { id: 7, name: 'Сокиряни', postalCode: '60200' },
      { id: 8, name: 'Сторожинець', postalCode: '59000' },
      { id: 9, name: 'Хотин', postalCode: '60000' },
      {
        id: 10, name: 'Чернівці', postalCode: '58000',
        district: [
          { id: 1, district: 'Першотравневий' },
          { id: 2, district: 'Садгірський' },
          { id: 3, district: 'Шевченківський' },
        ]

      }
    ]
  },
  {
    id: 25,
    name: 'Чернігівська',
    cities: [
      { id: 0, name: 'Батурин', postalCode: '16513' },
      { id: 1, name: 'Бахмач', postalCode: '16500' },
      { id: 2, name: 'Бобровиця', postalCode: '17408' },
      { id: 3, name: 'Борзна', postalCode: '16404' },
      { id: 4, name: 'Городня', postalCode: '15106' },
      { id: 5, name: 'Ічня', postalCode: '16700' },
      { id: 6, name: 'Корюківка', postalCode: '15304' },
      { id: 7, name: 'Мена', postalCode: '15614' },
      { id: 8, name: 'Ніжин', postalCode: '16617' },
      { id: 9, name: 'Новгород-Сіверський', postalCode: '16004' },
      { id: 10, name: 'Носівка', postalCode: '17105' },
      { id: 11, name: 'Остер', postalCode: '17045' },
      { id: 12, name: 'Прилуки', postalCode: '17515' },
      { id: 13, name: 'Семенівка', postalCode: '15400' },
      { id: 14, name: 'Сновськ', postalCode: '15200' },
      {
        id: 15, name: 'Чернігів', postalCode: '14000',
        district: [
          { id: 1, district: 'Деснянський' },
          { id: 2, district: 'Новозаводський' },
        ]
      }
    ]
  },
];

export const cities = [
  {
    id: 10,
    name: 'Київ',
    nameEn: 'kyiv',
    region: 'Київська',
    regionEn: 'Kyiv',
    icon: 'assets/icon-city/1.svg',
    population: 2963000,
    regionСenter: 'Київ',
    regionPopulation: 3605936
  },
  { id: 20, name: 'Харків', nameEn: 'kharkiv', region: 'Харківська', regionEn: 'Kharkiv', icon: 'assets/icon-city/2.svg', population: 1443000, regionСenter: 'Харків', regionPopulation: 2582464 },
  { id: 15, name: 'Одеса', nameEn: 'odesa', region: 'Одеська', regionEn: 'Odesa', icon: 'assets/icon-city/3.svg', population: 1013000, regionСenter: 'Одеса', regionPopulation: 2370724 },
  { id: 4, name: 'Дніпро', nameEn: 'dnipro', region: 'Дніпропетровська', regionEn: 'Dnipropetrovsk', icon: 'assets/icon-city/4.svg', population: 968500, regionСenter: 'Дніпро', regionPopulation: 3181904 },
  { id: 5, name: 'Донецьк', nameEn: 'donetsk', region: 'Донецька', regionEn: 'Donetsk', icon: 'assets/icon-city/5.svg', population: 929000, regionСenter: 'Донецьк', regionPopulation: 4103028 },
  { id: 8, name: 'Запоріжжя', nameEn: 'zaporizhzhia', region: 'Запорізька', regionEn: 'Zaporizhzhia', icon: 'assets/icon-city/6.svg', population: 722000, regionСenter: 'Запоріжжя', regionPopulation: 1666400 },
  { id: 13, name: 'Львів', nameEn: 'lviv', region: 'Львівська', regionEn: 'Lviv', icon: 'assets/icon-city/7.svg', population: 717800, regionСenter: 'Львів', regionPopulation: 2492829 },
  { id: 26, name: 'Кривий Ріг', nameEn: 'kryvyi-rih', region: 'Дніпропетровська', regionEn: 'Dnipropetrovsk', icon: 'assets/icon-city/8.svg', population: 619278, regionСenter: 'Дніпро', regionPopulation: 3181904 },
  { id: 14, name: 'Миколаїв', nameEn: 'mykolaiv', region: 'Миколаївська', regionEn: 'Mykolaiv', icon: 'assets/icon-city/9.svg', population: 476200, regionСenter: 'Миколаїв', regionPopulation: 1097712 },
  { id: 1, name: 'Сімферополь', nameEn: 'simferopol', region: 'АР Крим', regionEn: 'Crimea', icon: 'assets/icon-city/10.svg', population: 341700, regionСenter: 'Сімферополь', regionPopulation: 1903000 },
  { id: 21, name: 'Херсон', nameEn: 'kherson', region: 'Херсонська', regionEn: 'Kherson', icon: 'assets/icon-city/11.svg', population: 286958, regionСenter: 'Херсон', regionPopulation: 1002030 },
  { id: 25, name: 'Чернігів', nameEn: 'chernihiv', region: 'Чернігівська', regionEn: 'Chernihiv', icon: 'assets/icon-city/12.svg', population: 286899, regionСenter: 'Чернігів', regionPopulation: 976701 },
  { id: 23, name: 'Черкаси', nameEn: 'cherkasy', region: 'Черкаська', regionEn: 'Cherkasy', icon: 'assets/icon-city/13.svg', population: 276360, regionСenter: 'Черкаси', regionPopulation: 1141364 },
  { id: 16, name: 'Полтава', nameEn: 'poltava', region: 'Полтавська', regionEn: 'Poltava', icon: 'assets/icon-city/14.svg', population: 289800, regionСenter: 'Полтава', regionPopulation: 1384233 },
  { id: 24, name: 'Чернівці', nameEn: 'chernivtsi', region: 'Чернівецька', regionEn: 'Chernivtsi', icon: 'assets/icon-city/15.svg', population: 267060, regionСenter: 'Чернівці', regionPopulation: 901632 },
  { id: 6, name: 'Житомир', nameEn: 'zhytomyr', region: 'Житомирська', regionEn: 'Zhytomyr', icon: 'assets/icon-city/16.svg', population: 266936, regionСenter: 'Житомир', regionPopulation: 1205752 },
  { id: 18, name: 'Суми', nameEn: 'sumy', region: 'Сумська', regionEn: 'Sumy', icon: 'assets/icon-city/17.svg', population: 265500, regionСenter: 'Суми', regionPopulation: 1043275 },
  { id: 17, name: 'Рівне', nameEn: 'rivne', region: 'Рівненська', regionEn: 'Rivne', icon: 'assets/icon-city/18.svg', population: 246003, regionСenter: 'Рівне', regionPopulation: 1143523 },
  { id: 11, name: 'Кропивницький', nameEn: 'kropyvnytskyi', region: 'Кіровоградська', regionEn: 'Kirovohrad', icon: 'assets/icon-city/19.svg', population: 232052, regionСenter: 'Кропивницький', regionPopulation: 901188 },
  { id: 22, name: 'Хмельницький', nameEn: 'khmelnytskyi', region: 'Хмельницька', regionEn: 'Khmelnytskyi', icon: 'assets/icon-city/20.svg', population: 274582, regionСenter: 'Хмельницький', regionPopulation: 1230828 },
  { id: 9, name: 'Івано-Франківськ', nameEn: 'ivano-frankivsk', region: 'Івано-Франківська', regionEn: 'Ivano-Frankivsk', icon: 'assets/icon-city/21.svg', population: 238623, regionСenter: 'Івано-Франківськ', regionPopulation: 1366692 },
  { id: 2, name: 'Вінниця', nameEn: 'vinnytsia', region: 'Вінницька', regionEn: 'Vinnytsia', icon: 'assets/icon-city/22.svg', population: 372484, regionСenter: 'Вінниця', regionPopulation: 1498143 },
  { id: 12, name: 'Луганськ', nameEn: 'luhansk', region: 'Луганська', regionEn: 'Luhansk', icon: 'assets/icon-city/23.svg', population: 413300, regionСenter: 'Луганськ', regionPopulation: 2179421 },
  { id: 3, name: 'Луцьк', nameEn: 'lutsk', region: 'Волинська', regionEn: 'Volyn', icon: 'assets/icon-city/24.svg', population: 213600, regionСenter: 'Луцьк', regionPopulation: 1038981 },
  { id: 7, name: 'Ужгород', nameEn: 'uzhhorod', region: 'Закарпатська', regionEn: 'Zakarpattia', icon: 'assets/icon-city/25.svg', population: 115800, regionСenter: 'Ужгород', regionPopulation: 1248425 },
  { id: 19, name: 'Тернопіль', nameEn: 'ternopil', region: 'Тернопільська', regionEn: 'Ternopil', icon: 'assets/icon-city/26.svg', population: 221820, regionСenter: 'Тернопіль', regionPopulation: 1021185 },

  // { id: 27, name: 'Маріуполь', nameEn: '', region: 'Донецька', icon: 'assets/icon-city/5.svg', population: 431859, regionСenter: 'Донецьк', regionPopulation: 4103028 },
  // { id: 28, name: 'Камʼянське', nameEn: '', region: 'Дніпропетровська', icon: 'assets/icon-city/4.svg', population: 229828, regionСenter: 'Дніпро', regionPopulation: 3181904 },
  // { id: 30, name: 'Кременчук', nameEn: '', region: 'Полтавська', icon: 'assets/icon-city/14.svg', population: 219022, regionСenter: 'Полтава', regionPopulation: 1384233 },
  // { id: 31, name: 'Краматорськ', nameEn: '', region: 'Донецька', icon: 'assets/icon-city/5.svg', population: 154005, regionСenter: 'Донецьк', regionPopulation: 4103028 },
  // { id: 32, name: 'Мелітополь', nameEn: '', region: 'Запорізька', icon: 'assets/icon-city/6.svg', population: 149364, regionСenter: 'Запоріжжя', regionPopulation: 1666400 },
  // { id: 33, name: 'Словʼянськ', nameEn: '', region: 'Донецька', icon: 'assets/icon-city/5.svg', population: 111152, regionСenter: 'Донецьк', regionPopulation: 4103028 },
  // { id: 34, name: 'Нікополь', nameEn: '', region: 'Дніпропетровська', icon: 'assets/icon-city/4.svg', population: 116446, regionСenter: 'Дніпро', regionPopulation: 3181904 },
  // { id: 35, name: 'Бердянськ', nameEn: '', region: 'Запорізька', icon: 'assets/icon-city/6.svg', population: 112000, regionСenter: 'Запоріжжя', regionPopulation: 1666400 },
  // { id: 36, name: 'Сєвєродонецьк', nameEn: '', region: 'Луганська', icon: 'assets/icon-city/23.svg', population: 106188, regionСenter: 'Луганськ', regionPopulation: 2179421 },
  // { id: 37, name: 'Алчевськ', nameEn: '', region: 'Луганська', icon: 'assets/icon-city/23.svg', population: 104258, regionСenter: 'Луганськ', regionPopulation: 2179421 },
  // { id: 39, name: 'Павлоград', nameEn: '', region: 'Дніпропетровська', icon: 'assets/icon-city/4.svg', population: 108235, regionСenter: 'Дніпро', regionPopulation: 3181904 },
  // { id: 40, name: 'Лисичанськ', nameEn: '', region: 'Луганська', icon: 'assets/icon-city/23.svg', population: 103343, regionСenter: 'Луганськ', regionPopulation: 2179421 },
  // { id: 41, name: 'Єнакієве', nameEn: '', region: 'Донецька', icon: 'assets/icon-city/5.svg', population: 100706, regionСenter: 'Донецьк', regionPopulation: 4103028 },
  // { id: 42, name: 'Макіївка', nameEn: '', region: 'Донецька', icon: 'assets/icon-city/5.svg', population: 345563, regionСenter: 'Донецьк', regionPopulation: 4103028 },
  // { id: 43, name: 'Умань', nameEn: '', region: 'Черкаська', icon: 'assets/icon-city/13.svg', population: 82834, regionСenter: 'Черкаси', regionPopulation: 1141364 },
  // { id: 44, name: 'Ізмаїл', nameEn: '', region: 'Одеська', icon: 'assets/icon-city/3.svg', population: 70523, regionСenter: 'Одеса', regionPopulation: 2370724 },

  // { id: 100, name: 'Баришівка', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 11432, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 101, name: 'Березань', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 16272, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 102, name: 'Біла Церква', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 209238, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 103, name: 'Богуслав', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 15724, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 104, name: 'Бориспіль', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 63302, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 105, name: 'Бородянка', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 13734, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 106, name: 'Боярка', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 35195, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 107, name: 'Бровари', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 108315, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 108, name: 'Буча', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 37560, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 109, name: 'Васильків', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 37464, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 110, name: 'Велика Димерка', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 10150, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 111, name: 'Вишгород', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 28761, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 112, name: 'Вишневе', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 42910, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 113, name: 'Глеваха', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 9700, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 114, name: 'Гостомель', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 16532, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 115, name: 'Іванків', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 10075, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 116, name: 'Ірпінь', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 74700, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 117, name: 'Кагарлик', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 13783, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 118, name: 'Коцюбинське', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 15390, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 119, name: 'Крюківщина', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 9928, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 120, name: 'Макарів', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 10432, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 121, name: 'Миронівка', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 11650, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 122, name: 'Обухів', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 33677, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 123, name: 'Переяслав', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 27200, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 124, name: 'Ржищів', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 7275, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 125, name: 'Рокитне', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 11234, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 126, name: 'Сквира', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 16120, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 127, name: 'Славутич', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 24338, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 128, name: 'Ставище', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 6694, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 129, name: 'Тараща', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 10932, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 130, name: 'Тетіїв', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 13212, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 131, name: 'Узин', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 12053, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 132, name: 'Українка', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 16907, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 133, name: 'Фастів', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 48167, regionСenter: 'Київ', regionPopulation: 3605936 },
  // { id: 134, name: 'Яготин', nameEn: '', region: 'Київська', icon: 'assets/icon-city/1.svg', population: 20469, regionСenter: 'Київ', regionPopulation: 3605936 },
];



// // Сортуємо міста за алфавітом
// cities.sort((a, b) => a.name.localeCompare(b.name));

// // Переприсвоюємо id по порядку
// cities.forEach((city, index) => {
//   city.id = index + 1;
// });

// Сортуємо міста за кількістю населення у спадному порядку
cities.sort((a, b) => b.population - a.population);

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
