const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs-extra');
const path = require('path');
const { Readable } = require('stream');

console.log('Запуск генерації карти сайту');

// Вказати базовий URL вашого сайту
const baseUrl = 'https://discussio.site';

// Вказати маршрути вашого Angular додатка з пріоритетами
const routes = [
  { url: '/', priority: 1.0 },
  { url: '/home', priority: 1.0 },
  { url: '/about-project', priority: 0.5 },
  { url: '/blog', priority: 1.0 },
  { url: '/support-us', priority: 0.5 },
  { url: '/user-licence', priority: 0.5 },
  { url: '/our-team', priority: 0.5 },
  { url: '/faq', priority: 0.5 },
  { url: '/auth/login', priority: 0.8 },
  { url: '/auth/registration', priority: 0.8 },
  { url: '/user/search/house', priority: 0.8 },
  { url: '/user/agree/about', priority: 0.5 },
  { url: '/user/discus/about', priority: 0.5 },
  { url: '/user/tenant/about', priority: 0.5 },
  { url: '/user/tenant/step', priority: 0.5 },
  { url: '/user/edit/looking', priority: 1.0 },
  { url: '/house/agree/about', priority: 0.5 },
  { url: '/house/agree/step', priority: 0.5 },
  { url: '/house/objects/about', priority: 0.5 },
  { url: '/house/residents/about', priority: 0.5 },
  { url: '/house/control/about', priority: 0.5 },
  { url: '/house/discus/about', priority: 0.5 },
  { url: '/house/search/tenant', priority: 0.8 },
  { url: '/house/search/neighbor', priority: 0.8 },
  { url: '/house/communal/about', priority: 0.5 },
  { url: '/search/tenant', priority: 1.0 },
  { url: '/search/house', priority: 1.0 },
];

console.log('Маршрути:', routes);

// Функція для форматування дати у форматі YYYY-MM-DD
const formatDate = date => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Поточна дата у форматі YYYY-MM-DD
const currentDate = formatDate(new Date());

console.log('Поточна дата:', currentDate);

// Створення потоку Sitemap
const stream = new SitemapStream({ hostname: baseUrl });

const urls = routes.map(route => ({
  url: route.url,
  changefreq: 'always',
  priority: route.priority, // Додаємо пріоритет із кожного маршруту
  lastmod: currentDate, // Додавання дати останньої зміни у форматі YYYY-MM-DD
}));

// Перевірка результату перед збереженням
console.log('Генеровані URL для карти сайту:', urls);

// Писати URL до потоку Sitemap
Readable.from(urls).pipe(stream);

// Перетворення потоку у строку та збереження
streamToPromise(stream).then(sm => {
  // Збереження у файл sitemap.xml у потрібну директорію
  fs.outputFile(path.join(__dirname, 'dist/project/browser', 'sitemap.xml'), sm.toString(), err => {
    if (err) {
      console.error('Помилка створення карти сайту:', err);
    } else {
      console.log('Карта сайту успішно створена!');
    }
  });
}).catch(err => {
  console.error('Помилка при генерації карти сайту:', err);
});
