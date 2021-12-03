import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import pkg from '../package.json';

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn: environment.SENTRY_DSN,
    environment: 'production',
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    release: `lighthouse-spa@${pkg.version}`,
  });
}

window.OpAuthHelper.onLogin(() => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
});
