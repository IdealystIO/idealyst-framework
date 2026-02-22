import type { IAPProviderStatus } from './types';

export const INITIAL_PROVIDER_STATUS: IAPProviderStatus = {
  state: 'uninitialized',
  isStoreAvailable: false,
};
