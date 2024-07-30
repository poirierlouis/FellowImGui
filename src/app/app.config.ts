import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideHttpClient} from "@angular/common/http";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from "@angular/platform-browser";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";
import {NgxColorsModule} from "ngx-colors";

import {routes} from './app.routes';
import {Database, db} from "./repositories/database";
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),
    provideAnimationsAsync(),
    provideHttpClient(),

    importProvidersFrom([
      HammerModule,
      NgxColorsModule
    ]),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    {provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline', subscriptSizing: 'dynamic'}},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 4000}},

    {provide: Database, useValue: db}
  ]
};
