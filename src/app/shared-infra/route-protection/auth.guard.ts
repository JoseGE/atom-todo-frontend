import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { USER_ACCESS_PROVIDER } from '../acces-control/user-access.tokens';

export const authenticationGuard: CanActivateFn = () => {
  const userAccessValidator = inject(USER_ACCESS_PROVIDER);
  const router = inject(Router);

  const isAuthenticated = userAccessValidator.isUserAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
