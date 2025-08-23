import { InjectionToken } from '@angular/core';

import { IUserAccessValidator } from './user-access.interface';

export const USER_ACCESS_PROVIDER = new InjectionToken<IUserAccessValidator>(
  'UserAccessProvider'
);
