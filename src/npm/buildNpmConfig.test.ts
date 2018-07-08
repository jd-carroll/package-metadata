import 'jest';
import * as fs from 'fs';
import { promisify } from 'util';
import buildNpmConfig from './buildNpmConfig';

const fsWrite = promisify(fs.writeFile);

describe('load npm configuration', () => {

  beforeEach(() => {
    jest.resetModuleRegistry();
  });

  afterEach((done) => {
    fs.stat('.npmrc', (err) => {
      if (err == null) {
        fs.unlink('.npmrc', done)
      } else {
        done();
      }
    })
  });

  const defaultRegistry = 'https://registry.npmjs.org/';

  it('should load the correct default registry', () => {
    const npmConfig = buildNpmConfig();
    expect(npmConfig.registry).toBe(defaultRegistry);
  });

  it('should load the registry from a .npmrc file', async () => {
    const npmrcRegistry = 'https://something.fun/';
    await fsWrite('.npmrc', `registry=${npmrcRegistry}`, 'utf8');
    // Even though the file has been successfully created, for some reason
    // node isn't always able to read it immediately. Adding a short breath...
    setTimeout(() => {
      const npmConfig = buildNpmConfig();
      expect(npmConfig.registry).toBe(npmrcRegistry);
    }, 50);
  });

  it('should load a scoped registry', async () => {
    const npmrcRegistry = 'https://something-private.fun/';
    const scope = '@private-repo';
    await fsWrite('.npmrc', `${scope}:registry=${npmrcRegistry}`, 'utf8');
    // Even though the file has been successfully created, for some reason
    // node isn't always able to read it immediately. Adding a short breath...
    setTimeout(() => {
      const npmConfig = buildNpmConfig(scope);
      expect(npmConfig.registry).toBe(npmrcRegistry);
    }, 50);
  });

  it('should fallback to the default registry if none is provided for the scope', async () => {
    const scope = '@private-repo';
    const npmConfig = buildNpmConfig(scope);
    expect(npmConfig.registry).toBe(defaultRegistry);
  });

});
