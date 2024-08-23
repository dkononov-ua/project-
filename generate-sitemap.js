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
  '/about-project',
  '/blog',
  '/support-us',
  '/user-licence',
  '/our-team',

  '/auth/login',
  '/auth/registration',

  '/user/search/house',
  '/user/agree/about',
  '/user/discus/about',
  '/user/tenant/about',
  '/user/agree/step',

  '/house/agree/about',
  '/house/agree/step',
  '/house/objects/about',
  '/house/residents/about',
  '/house/control/about',
  '/house/discus/about',
  '/house/search/tenant',
  '/house/search/neighbor',

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
