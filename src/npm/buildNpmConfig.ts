import { NpmConfig } from './';

const npmConf = require('npm-conf');

export const buildNpmConfig = (scope?: string): NpmConfig => {
  const config = npmConf();

  const npmConfig: NpmConfig = {
    proxy: {
      http: config.get(`${scope}:proxy`) || config.get('proxy'),
      https: config.get(`${scope}:https-proxy`) || config.get('https-proxy'),
      localAddress: config.get(`${scope}:local-address`) || config.get('local-address')
    },
    ssl: {
      certificate: config.get(`${scope}:cert`) || config.get('cert'),
      key: config.get(`${scope}:key`) || config.get('key'),
      ca: config.get(`${scope}:ca`) || config.get('ca'),
      strict: config.get(`${scope}:strict-ssl`) || config.get('strict-ssl')
    },
    registry: config.get(`${scope}:registry`) || config.get('registry')
  }

  return npmConfig;
};

export default buildNpmConfig;
