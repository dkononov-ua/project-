const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs-extra');
const path = require('path');
const { Readable } = require('stream');

console.log('Запуск генерації карти сайту');

// Вказати базовий URL вашого сайту
const baseUrl = 'https://discussio.site';

// Вказати маршрути вашого Angular додатка
const routes = [
  '/',
  '/home',
  '/home/about-project',
  '/home/update',
  '/home/support-us',
  '/home/our-team',
  '/auth/login',
  '/auth/registration',
  '/discussio-search',
];

console.log('Маршрути:', routes);

// Створення потоку Sitemap
const stream = new SitemapStream({ hostname: baseUrl });

// Генерація URL для карти сайту
const urls = routes.map(route => ({
  url: baseUrl + route,
  changefreq: 'monthly',
  priority: 0.8,
}));

// Писати URL до потоку Sitemap
Readable.from(urls).pipe(stream);

// Перетворення потоку у строку та збереження
streamToPromise(stream).then(sm => {
  fs.outputFile(path.join(__dirname, 'dist/project', 'sitemap.xml'), sm, err => {
    if (err) {
      console.error('Помилка створення карти сайту:', err);
    } else {
      console.log('Карта сайту успішно створена!');
    }
  });
}).catch(err => {
  console.error('Помилка при генерації карти сайту:', err);
});
