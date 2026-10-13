import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:5001/',
  redirectUri: baseUrl,
  clientId: 'PayFlow_App',
  responseType: 'code',
  scope: 'offline_access PayFlow',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'PayFlow',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:5001',
      rootNamespace: 'PayFlow',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'deepmerge',
  },
} as Environment;
