// Основні варіанти значень для мета-тега robots:
// index: Пошукові системи можуть індексувати сторінку (включити її в результати пошуку).
// noindex: Сторінка не повинна індексуватися (не повинна з'являтися в результатах пошуку).
// follow: Пошукові системи можуть слідувати за посиланнями на сторінці (оцінювати їх для включення у результати пошуку).
// nofollow: Пошукові системи не повинні слідувати за посиланнями на сторінці.
// noarchive: Пошукові системи не повинні зберігати кешовану версію сторінки.
// nosnippet: Пошукові системи не повинні показувати текстовий сніпет у результатах пошуку.
// noodp: Пошукові системи не повинні використовувати дані з Open Directory Project (ODP) для опису сторінки.
// noimageindex: Пошукові системи не повинні індексувати зображення на сторінці.

export const pageConfig = {
  '/user/info':
  {
    title: 'Користувач',
    description: 'Профіль',
    metaTitle: 'Профіль користувача',
    metaDescriptions: 'Переглядайте вашу інформацію та керуйте аккаунтом',
    metaKeywords: 'акаунт, профіль користувача, моя сторінка, мій профіль, prifile',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/user/edit':
  {
    title: 'Редагування',
    description: 'Профілю користувача',
    metaTitle: 'Редагування профілю користувача',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/user/tenant/about':
  {
    title: 'Що це таке?',
    description: 'Профіль орендаря',
    metaTitle: 'Профіль орендаря – Discussio',
    metaDescriptions: 'Дізнайтеся, як створювати та розміщувати оголошення про пошук житла на Discussio. Всі деталі про профіль орендаря і як він допомагає у пошуку ідеального місця для проживання.',
    metaKeywords: 'профіль орендаря, оголошення про пошук житла, створення оголошень, розміщення оголошень, допомога у пошуку оселі, орендар, пошук житла, управління профілем, можливості оренди',
    metaImg: 'https://discussio.site/assets/menu/tenants.png',
    metaUrl: 'https://discussio.site/user/tenant/about',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/user/tenant/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/user/tenant/step':
  {
    title: 'Як це працює?',
    description: 'Покрокове пояснення',
    metaTitle: 'Активація профілю орендаря – покрокове пояснення на Discussio',
    metaDescriptions: 'Детальне покрокове керівництво з активації профілю орендаря і розміщення оголошень про пошук житла. Все, що вам потрібно знати, щоб ефективно використовувати Discussio.',
    metaKeywords: 'профіль орендаря, активація профілю, розміщення оголошень, пошук житла, покрокове пояснення, налаштування профілю, керівництво користувача, Discussio',
    metaImg: '',
    metaUrl: 'https://discussio.site/user/tenant/step',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/user/tenant/step',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/user/agree/about':
  {
    title: 'Що це таке?',
    description: 'Угоди орендаря',
    metaTitle: 'Створення угод оренди житла на Discussio',
    metaDescriptions: 'Облегшене створення угод між орендарем та орендодавцем за кілька кліків. Наш сервіс допоможе вам швидко і безпечно укласти угоду оренди житла.',
    metaKeywords: 'угода оренди, створення угод, укласти угоду, сформувати угоду, завантажити угоду оренди, надрукувати угоду, Discussio',
    metaImg: 'https://discussio.site/assets/example-agree/man_and_door4.jpg',
    metaUrl: 'https://discussio.site/user/agree/about',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/user/agree/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/user/agree/step':
  {
    title: 'Як це працює?',
    description: 'Отримання угоди',
    metaTitle: 'Як працює створення угоди оренди на Discussio',
    metaDescriptions: 'Детальне пояснення, як створюється угода оренди нерухомості в Діскусіо. Відповіді на питання про процес укладення угоди для орендаря.',
    metaKeywords: 'як це працює, створення угоди оренди, укласти угоду, процес угоди, нерухомість, орендар, Діскусіо',
    metaImg: '',
    metaUrl: 'https://discussio.site/user/agree/step',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/user/agree/step',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/user/agree/review':
  {
    title: 'Угоди орендаря',
    description: 'Запропоновані',
    metaTitle: 'Запропоновані угоди',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/user/agree/concluded':
  {
    title: 'Угоди орендаря',
    description: 'Ухвалені',
    metaTitle: 'Ухвалені угоди',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/user/discus/about':
  {
    title: 'Що це таке?',
    description: 'Система підписок',
    metaTitle: 'Система підписок та дискусій в Діскусіо та як це працює для орендаря',
    metaDescriptions: 'Пояснення як працює система підписок та дискусій в Діскусіо для орендаря',
    metaKeywords: 'вподобані, сподобалась оселя, запропоновані, запропонувати, підписка, підписники, дискусія, система дискусій, пояснення, послідовність',
    metaImg: 'https://discussio.site/assets/menu/discuss.png',
    metaUrl: 'https://discussio.site/user/discus/about',
    metaAuthor: 'Discussio',
    metaCanonical: 'https://discussio.site/user/discus/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/user/discus/subscriptions':
  {
    title: 'Користувач',
    description: 'Вподобані',
    metaTitle: 'Вподобані оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/user/discus/subscribers':
  {
    title: 'Користувач',
    description: 'Запропоновані',
    metaTitle: 'Запропоновані оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/user/discus/discussion':
  {
    title: 'Користувач',
    description: 'Дискусії',
    metaTitle: 'Дискусії орендаря',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '':
  {
    title: 'Discussio',
    description: 'Головна',
    metaTitle: 'Діскусіо - управління нерухомістю, оренда житла, пошук орендарів',
    metaDescriptions: 'Discussio - платформа для ефективного управління нерухомістю. Потрібно знайти оселю чи орендаря? Ми допоможемо з пошуком житла та орендарів, а також з формуванням угод.',
    metaKeywords: 'нерухомість, оренда житла, пошук орендарів, управління нерухомістю, підселення, пошук сусіда, розміщення оголошень, діскусіо, discussio, оренда, пошук оселі',
    metaImg: 'https://discussio.site/assets/gif/home.gif',
    metaUrl: 'https://discussio.site/home',
    metaAuthor: 'Discussio',
    metaCanonical: 'https://discussio.site/home',
    metaThemeColor: '#FF7D66',
    metaRobots: 'index, follow'
  },

  '/home':
  {
    title: 'Discussio',
    description: 'Головна',
    metaTitle: 'Діскусіо - управління нерухомістю, оренда житла, пошук орендарів',
    metaDescriptions: 'Discussio - платформа для ефективного управління нерухомістю. Потрібно знайти оселю чи орендаря? Ми допоможемо з пошуком житла та орендарів, а також з формуванням угод.',
    metaKeywords: 'нерухомість, оренда житла, пошук орендарів, управління нерухомістю, підселення, пошук сусіда, розміщення оголошень, діскусіо, discussio, оренда, пошук оселі',
    metaImg: 'https://discussio.site/assets/gif/home.gif',
    metaUrl: 'https://discussio.site/home',
    metaAuthor: 'Discussio',
    metaCanonical: 'https://discussio.site/home',
    metaThemeColor: '#FF7D66',
    metaRobots: 'index, follow'
  },

  '/blog':
  {
    title: 'Discussio',
    description: 'Блог',
    metaTitle: 'Блог Discussio: оренда нерухомості та нові функції платформи',
    metaDescriptions: 'Слідкуйте за розвитком платформи Discussio та дізнавайтеся про нові функції. Підпишіться на оновлення та підтримайте наш проект!',
    metaKeywords: 'блог, оренда нерухомості, новини, Discussio, платформа Discussio, нові функції, оновлення',
    metaImg: 'https://discussio.site/assets/blog/blog.png',
    metaUrl: 'https://discussio.site/blog',
    metaAuthor: 'Discussio Blog',
    metaCanonical: 'https://discussio.site/blog',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/faq':
  {
    title: 'Discussio',
    description: 'F.A.Q',
    metaTitle: 'FAQ Discussio: Часті питання та відповіді',
    metaDescriptions: 'Відповіді на найчастіше задавані питання користувачів Discussio. Дізнайтесь, як працює платформа, та знайдіть необхідну інформацію.',
    metaKeywords: 'FAQ, часті питання, відповіді, як це працює, допомога, Discussio, користувачі',
    metaImg: 'https://discussio.site/assets/faq/faq.png',
    metaUrl: 'https://discussio.site/faq',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/faq',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/our-team':
  {
    title: 'Discussio',
    description: 'Команда',
    metaTitle: 'Команда Discussio: Розвиток платформи та майбутнє',
    metaDescriptions: 'Дізнайтеся більше про команду, яка стоїть за розвитком Discussio. Приєднуйтесь до нас і допоможіть створити продукт, корисний для всіх, не лише в Україні, а й за її межами!',
    metaKeywords: 'команда, засновники, управління, компанія, Discussio, розвиток платформи, інновації, проєкт, стартап, команда Discussio',
    metaImg: 'https://discussio.site/assets/gif/team.gif',
    metaUrl: 'https://discussio.site/our-team',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/our-team',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/contacts':
  {
    title: 'Контакти - Discussio',
    description: 'Зв’яжіться з Discussio, соціальною платформою для управління нерухомістю. Дізнайтесь, як ви можете з нами зв’язатися для підтримки, питань або співпраці.',
    metaTitle: 'Контакти - Discussio',
    metaDescriptions: 'Ми надаємо інформацію про те, як зв’язатися з Discussio для отримання підтримки, питань чи співпраці. Ознайомтесь із нашими контактами та зв’яжіться з нами.',
    metaKeywords: 'контакти, зв’язок, підтримка, співпраця, Discussio, управління нерухомістю',
    metaImg: 'https://discussio.site/assets/gif/contacts.gif',
    metaUrl: 'https://discussio.site/contacts',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/contacts',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/user-licence':
  {
    title: 'Угода користувача - Discussio',
    description: 'Ознайомтесь з угодою користувача Discussio, яка визначає права, обов’язки та відповідальність користувачів платформи.',
    metaTitle: 'Угода користувача - Discussio',
    metaDescriptions: 'Читати про права, обов’язки та відповідальність користувачів Discussio. Угода користувача визначає умови використання платформи.',
    metaKeywords: 'угода користувача, права користувача, обов’язки, Discussio, умови використання',
    metaImg: 'https://discussio.site/assets/img/user-licence.png', // Замініть на реальне зображення, якщо є
    metaUrl: 'https://discussio.site/user-licence',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/user-licence',
    metaThemeColor: '#FFFFFF', // Вказаний колір теми
    metaRobots: 'index, follow'
  },

  '/about-project':
  {
    title: 'Що таке Discussio?',
    description: 'Про проект',
    metaTitle: 'Що таке - Discussio™. Інформація про проект та наші функції',
    metaDescriptions: 'Discussio це соціальна платформа для нерухомості, що поєднує функціонал соціальної мережі з інструментами управління житлом. Вона орієнтована на полегшення процесу оренди та надання нових послуг у цій сфері.',
    metaKeywords: 'про проект, ознайомлення, наш проект, мета проекту, ціль проекту, Discussio, платформа для нерухомості, соціальна мережа, управління житлом, оренда житла',
    metaImg: 'https://discussio.site/assets/gif/obj.gif',
    metaUrl: 'https://discussio.site/about-project',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/about-project',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/support-us':
  {
    title: 'Допомога',
    description: 'Підтримайте розвиток Discussio',
    metaTitle: 'Підтримайте Discussio™ - Платформа для управління нерухомістю',
    metaDescriptions: 'Ми прагнемо зробити Discussio найкращою платформою для управління нерухомістю, і ваша підтримка є ключовою для нашого успіху. Долучайтеся до розвитку проекту, внесіть свій вклад і допоможіть реалізувати наші плани з покращення функціональності сервісу. Кожен внесок, незалежно від розміру, наближає нас до створення ще зручнішого і кориснішого продукту для наших користувачів.',
    metaKeywords: 'допомога, підтримка, донати, інвестиції, розвиток проекту, участь у розвитку, Discussio',
    metaImg: 'https://discussio.site/assets/gif/discussio.gif',
    metaUrl: 'https://discussio.site/support-us',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/support-us',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/house/info':
  {
    title: 'Оселя',
    description: 'Профіль',
    metaTitle: 'Профіль оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/control/add':
  {
    title: 'Оселя',
    description: 'Керування',
    metaTitle: 'Керування оселями',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/control/about':
  {
    title: 'Що це таке?',
    description: 'Профіль оселі',
    metaTitle: 'Профіль оселі в Discussio™ - Як управляти вашими оселями',
    metaDescriptions: 'В Discussio ви можете створювати та управляти профілями осель, що дозволяє ефективно контролювати інформацію про ваше житло. Зручний інтерфейс для додавання, редагування і моніторингу кількох осель допоможе вам легко управляти вашими об’єктами нерухомості.',
    metaKeywords: 'профіль оселі, управління оселями, створення профілю, додати оселю, керування житлом, контроль оселі, управлінський інтерфейс, ефективне управління',
    metaImg: 'https://discussio.site/assets/menu/control.png',
    metaUrl: 'https://discussio.site/house/control/about',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/control/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/house/agree/about':
  {
    title: 'Що це таке?',
    description: 'Угоди оселі',
    metaTitle: 'Створення угод оренди житла в Discussio™',
    metaDescriptions: 'Discussio спрощує процес укладання угод оренди житла, надаючи зручний інструмент для створення, редагування та завантаження угод між орендарями та орендодавцями всього за кілька кліків.',
    metaKeywords: 'угода оренди, створення угоди, укласти угоду, формування угоди, завантажити угоду, шаблони угод, оренда житла, документи оренди',
    metaImg: 'https://discussio.site/assets/menu/agree.png',
    metaUrl: 'https://discussio.site/house/agree/about',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/agree/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/house/agree/step':
  {
    title: 'Як це працює?',
    description: 'Угоди оселі',
    metaTitle: 'Як створити угоду оренди житла в Discussio™',
    metaDescriptions: 'Детальний посібник по створенню угоди оренди житла на платформі Discussio. Дізнайтеся, як легко і швидко укласти угоду між орендарем та орендодавцем за допомогою наших інструментів.',
    metaKeywords: 'угода оренди, створення угоди, як укласти угоду, процес формування угоди, шаблони угод, оренда житла, інструкція по угоді',
    metaImg: 'https://discussio.site/assets/menu/agree.png',
    metaUrl: 'https://discussio.site/house/agree/step',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/agree/step',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/house/agree/review':
  {
    title: 'Угоди оселі',
    description: 'Запропоновані',
    metaTitle: 'Запропоновані угоди орендарям',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/agree/concluded':
  {
    title: 'Угоди оселі',
    description: 'Ухвалені',
    metaTitle: 'Ухвалені угоди',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/agree/create':
  {
    title: 'Угода оренди',
    description: 'Створити',
    metaTitle: 'Створення угоди оренди',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/discus/about':
  {
    title: 'Що це таке?',
    description: 'Система підписок',
    metaTitle: 'Система підписок в Discussio для орендодавців: Що це таке?',
    metaDescriptions: 'Ознайомтеся з системою підписок Discussio. Вивчіть, як ця система працює, її основні функції та переваги для користувачів. Ідеально підходить для управління орендними угодами.',
    metaKeywords: 'система підписок, Discussio, управління орендою, функції системи, підписка на оренду',
    metaImg: 'https://discussio.site/assets/menu/discussHouse.png',
    metaUrl: 'https://discussio.site/house/discus/about',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/discus/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/house/discus/subscriptions':
  {
    title: 'Оселя',
    description: 'Підписки',
    metaTitle: 'Підписки оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/discus/subscribers':
  {
    title: 'Оселя',
    description: 'Підписники',
    metaTitle: 'Підписники оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/discus/discussion':
  {
    title: 'Оселя',
    description: 'Дискусії',
    metaTitle: 'Дискусії оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/objects/about':
  {
    title: 'Що це таке?',
    description: 'Наповнення',
    metaTitle: 'Наповнення оселі: речі, меблі, техніка',
    metaDescriptions: 'Функція дозволяє користувачам зручно заповнювати шаблони для внесення інформації про речі в оселі, їх стан та інструкції з використання. Цей список використовується для формування акту прийому-передачі оселі.',
    metaKeywords: 'шаблони, наповнення оселі, речі, стан речей, опис предметів, меблі, побутова техніка, фото меблів, техніка, формування списку, акт прийому-передачі',
    metaImg: 'https://discussio.site/assets/menu/objects.png',
    metaUrl: 'https://discussio.site/house/objects/about',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/objects/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/house/objects/add':
  {
    title: 'Наповнення',
    description: 'Додати',
    metaTitle: 'Додати наповнення в оселю',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/objects/control':
  {
    title: 'Наповнення',
    description: 'Керування',
    metaTitle: 'Керування наповненням оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/edit/address':
  {
    title: 'Редагування',
    description: 'Розташування',
    metaTitle: 'Редагувати розташування оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/edit/param':
  {
    title: 'Редагування',
    description: 'Параметри',
    metaTitle: 'Редагувати параметри оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/edit/about':
  {
    title: 'Редагування',
    description: 'Особливості',
    metaTitle: 'Редагувати особливості оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/edit/photo':
  {
    title: 'Редагування',
    description: 'Фото',
    metaTitle: 'Редагувати фото оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/edit/additionally':
  {
    title: 'Редагування',
    description: 'Додатково',
    metaTitle: 'Редагувати додаткову інформацію',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/communal/about':
  {
    title: 'Що це таке?',
    description: 'Статистика',
    metaTitle: 'Як працює статистика комунальних витрат',
    metaDescriptions: 'Ця функція спрощує обмін інформацією між орендарем та орендодавцем, дозволяючи точно відслідковувати витрати на оселю та формувати звіти про споживання ресурсів. Контролюйте свої витрати легко та зручно.',
    metaKeywords: 'статистика, комунальні витрати, комуналка, облік комунальних послуг, передача показників, звіти споживання, оренда житла, управління витратами',
    metaImg: 'https://discussio.site/assets/menu/communal-statistics.png',
    metaUrl: 'https://discussio.site/house/communal/about',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/communal/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/house/communal/add':
  {
    title: 'Статистика',
    description: 'Керування',
    metaTitle: 'Керування статистикою',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/communal/stat-month':
  {
    title: 'Статистика',
    description: 'За місяць',
    metaTitle: 'Статистика за місяць',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/communal/stat-year':
  {
    title: 'Статистика',
    description: 'За рік',
    metaTitle: 'Статистика за рік',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/communal/history':
  {
    title: 'Статистика',
    description: 'Внесення',
    metaTitle: 'Внесення статистики оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/communal/stat-season':
  {
    title: 'Статистика',
    description: 'За сезон',
    metaTitle: 'Статистика за сезон',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/communal/company':
  {
    title: 'Налаштування',
    description: 'Послуги',
    metaTitle: 'Налаштування послуги оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/residents/about':
  {
    title: 'Що це таке?',
    description: 'Мешканці',
    metaTitle: 'Управління мешканцями оселі в Discussio™',
    metaDescriptions: 'Дізнайтеся, як функція "Мешканці" в Discussio™ допомагає орендодавцям і орендарям ефективно взаємодіяти. Орендарі можуть отримати доступ до важливої інформації про оселю після того, як стануть мешканцями, без необхідності постійного пояснення деталей.',
    metaKeywords: 'мешканці оселі, управління орендарями, взаємодія з мешканцями, інформація для орендарів, додати мешканця, угоди оренди, терміни оренди',
    metaImg: 'https://discussio.site/assets/menu/resident.png',
    metaUrl: 'https://discussio.site/house/residents/about',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/residents/about',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/house/residents/resident':
  {
    title: 'Мешканці',
    description: 'Оселі',
    metaTitle: 'Мешканці оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/residents/add':
  {
    title: 'Мешканці',
    description: 'Додати',
    metaTitle: 'Додати мешканців',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/house/residents/owner':
  {
    title: 'Мешканці',
    description: 'Власник',
    metaTitle: 'Власник оселі',
    metaDescriptions: '',
    metaKeywords: '',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'noindex, nofollow',
  },

  '/search/tenant':
  {
    title: 'Пошук Орендарів',
    description: 'Знаходьте орендарів по фільтрам',
    metaTitle: 'Пошук орендаря на Discussio™',
    metaDescriptions: 'На платформі Discussio™ ви можете знайти надійних орендарів для вашої оселі. Скористайтеся нашими інструментами для швидкого і ефективного пошуку підходящих кандидатів.',
    metaKeywords: 'пошук орендаря, орендарі, знайти орендаря, оголошення оренди, допомога в пошуку орендарів, орендодавець, здача оселі, оренда житла',
    metaImg: 'https://discussio.site/assets/menu/search-tenant.png',
    metaUrl: 'https://discussio.site/search/tenant',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/search/tenant',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/search/house':
  {
    title: 'Пошук',
    description: 'Оселі',
    metaTitle: 'Пошук оселі',
    metaDescriptions: 'Тут ви знайдете перевірені оселі для оренди або для купівлі',
    metaKeywords: 'пошук, шукаю, знайти, оселі, житла, житло, оселю, квартири, квартиру, будинок, будинків, кімнату, кімнат, орендую, зняти, зніму, в оренду',
    metaImg: '',
    metaUrl: '',
    metaAuthor: '',
    metaCanonical: '',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/user/search/house':
  {
    title: 'Як це працює?',
    description: 'Пошук оселі',
    metaTitle: 'Як знайти оселю для оренди чи купівлі',
    metaDescriptions: 'Детальний посібник з пошуку житла на платформі Діскусіо. Знайдіть квартиру, будинок або іншу нерухомість швидко та ефективно.',
    metaKeywords: 'діскусіо, пошук оселі, знайти житло, оренда квартири, купівля будинку, пошук житла, квартири, будинки, нерухомість, оренда житла',
    metaImg: 'https://discussio.site/assets/menu/search-house.png',
    metaUrl: 'https://discussio.site/user/search/house',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/user/search/house',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow'
  },

  '/house/search/tenant':
  {
    title: 'Як це працює?',
    description: 'Пошук орендаря',
    metaTitle: 'Як знайти орендаря для нерухомості',
    metaDescriptions: 'Детальний посібник з пошуку надійного орендаря для вашої нерухомості. Розміщуйте оголошення та знаходьте орендарів ефективно.',
    metaKeywords: 'пошук орендаря, знайти орендаря, здача в оренду, розмістити оголошення, оренда житла, пошук житла, орендарі, здаю житло, оренда оселі, пошук житла',
    metaImg: 'https://discussio.site/assets/menu/search-tenant.png',
    metaUrl: 'https://discussio.site/house/search/tenant',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/search/tenant',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/house/search/neighbor':
  {
    title: 'Як це працює?',
    description: 'Пошук сусіда',
    metaTitle: 'Як знайти сусіда для спільного проживання',
    metaDescriptions: 'Докладний посібник з пошуку ідеального сусіда. Розміщуйте оголошення та знаходьте співмешканців для спільної оренди.',
    metaKeywords: 'пошук сусіда, знайти сусіда, розмістити оголошення, сусід, співмешканець, співмешканка, розділити оренду, пошук квартиранта, шукаю сусіда',
    metaImg: 'https://discussio.site/assets/menu/search-neighbor.png',
    metaUrl: 'https://discussio.site/house/search/neighbor',
    metaAuthor: 'Discussio Team',
    metaCanonical: 'https://discussio.site/house/search/neighbor',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/auth/registration':
  {
    title: 'Реєстрація',
    description: 'На Discussio™',
    metaTitle: 'Реєстрація на Discussio™ – Платформа для управління нерухомістю',
    metaDescriptions: 'Зареєструйтесь на Discussio™ та отримайте доступ до зручного управління нерухомістю, пошуку осель і орендарів. Легко створіть профіль та користуйтеся всіма перевагами платформи.',
    metaKeywords: 'реєстрація, Discussio, обліковий запис, управління нерухомістю, пошук осель, створити профіль, орендарі, платформа для нерухомості',
    metaImg: '',
    metaUrl: 'https://discussio.site/auth/registration',
    metaAuthor: 'Discussio',
    metaCanonical: 'https://discussio.site/auth/registration',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

  '/auth/login':
  {
    title: 'Вхід',
    description: 'В аккаунт Discussio',
    metaTitle: 'Вхід на Discussio™ – Платформа для управління нерухомістю',
    metaDescriptions: 'Використовуйте свій обліковий запис Discussio™, щоб увійти на платформу. Отримайте доступ до всіх функцій і можливостей для управління нерухомістю та пошуку осель.',
    metaKeywords: 'Discussio, вхід, логін, обліковий запис, управління нерухомістю, платформа, доступ, орендарі',
    metaImg: '',
    metaUrl: 'https://discussio.site/auth/login',
    metaAuthor: 'Discussio',
    metaCanonical: 'https://discussio.site/auth/login',
    metaThemeColor: '#FFFFFF',
    metaRobots: 'index, follow',
  },

};
