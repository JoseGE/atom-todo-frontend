import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { USER_ACCESS_PROVIDER } from './shared-infra/acces-control/user-access.tokens';
import { authInterceptor } from './shared-infra/http-interceptors/auth.interceptor';
import { AuthenticationService } from './user-auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: USER_ACCESS_PROVIDER,
      useClass: AuthenticationService,
    },
  ],
};
