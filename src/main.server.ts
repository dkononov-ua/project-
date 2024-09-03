import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { join } from 'path';
import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import { AppServerModule } from './app/app.server.module';

if (environment.production) {
  enableProdMode();
}

const app = express();

const DIST_FOLDER = join(process.cwd(), 'dist/project/browser');

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

app.get('*', (req, res) => {
  res.render('index', { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
});

export { app };
