import 'jest';
import { RegistryClient } from '.';

describe('registry client tests', () => {

  it('should retrieve the latest tag', async () => {
    expect.assertions(1);
    const metadata = await RegistryClient.getMetadata('package-metadata-test');
    expect(metadata.versions.latest).toBeTruthy();
  });

  it('should retrieve a semantic version (< 1.0.0)', async () => {
    expect.assertions(1);
    const metadata = await RegistryClient.getMetadata('package-metadata-test', { version: '^0.1.0' });
    const packageMetadata = metadata.versions['^0.1.0'];
    expect(packageMetadata.version).toBe('0.1.1');
  });

  it('should retrieve a semantic version (> 1.0.0)', async () => {
    expect.assertions(1);
    const metadata = await RegistryClient.getMetadata('package-metadata-test', { version: '^1.0.0' });
    const packageMetadata = metadata.versions['^1.0.0'];
    expect(packageMetadata.version).toBe('1.2.0');
  });

  it('should retrieve a static version', async () => {
    expect.assertions(1);
    const metadata = await RegistryClient.getMetadata('package-metadata-test', { version: '0.1.1' });
    const packageMetadata = metadata.versions['0.1.1'];
    expect(packageMetadata.version).toBe('0.1.1');
  });

  it('shold retrieve a generic dist-tag', async () => {
    expect.assertions(1);
    const metadata = await RegistryClient.getMetadata('package-metadata-test', { version: 'next' });
    const packageMetadata = metadata.versions['next'];
    expect(packageMetadata.version).toBe('1.2.0');
  });

  it('should throw if the package is not found', async () => {
    const packageName = 'random-package-metadata-test';
    const metadata = RegistryClient.getMetadata(packageName);
    return expect(metadata).rejects.toThrowError(`Unable to find metadata for package: ${packageName}`);
  });

  it('should throw if the version requirement cannot be satisified', async () => {
    const version = '^2.0.0';
    const metadata =  RegistryClient.getMetadata('package-metadata-test', { version: version });
    return expect(metadata).rejects.toThrowError(`Unable to find metadata for version: ${version}`);
  });

  it('should return all versions', async () => {
    expect.assertions(1);
    const metadata = await RegistryClient.getMetadata('package-metadata-test', { allVersions: true });
    const versions = Object.keys(metadata.versions);
    expect(versions.length).toBe(6);
  });

  it('should return a single version', async () => {
    expect.assertions(1);
    const metadata = await RegistryClient.getMetadata('package-metadata-test');
    const versions = Object.keys(metadata.versions);
    expect(versions.length).toBe(1);
  });

  it('should return all available metadata', async () => {
    expect.assertions(1);
    const metadata = await RegistryClient.getMetadata('package-metadata-test', { fullMetadata: true });
    console.log(JSON.stringify(metadata, null, 2));
    expect(metadata.versions.latest.custom_metadata).toBeTruthy();
  });

});
