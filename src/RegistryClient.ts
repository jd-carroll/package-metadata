import { to } from 'await-to-js';
import * as pRequest from 'request-promise-native';
import * as url from 'url';

import { findVersionMetadata, MetadataOptions, PackageMetadata } from '.';
import { buildNpmConfig, buildNpmCredentials } from './npm';

const DEFAULT_OPTIONS: MetadataOptions = {
  allMetadata: false,
  allVersions: false,
  fullMetadata: false,
  version: 'latest'
};

/**
 * A simple client interface to the npm repository
 */
export class RegistryClient {

  /**
   * Retrieves metadata on the provided package name.
   *
   * If a `dist-tag` is specified in the options, a lookup will first be performed
   * to find the version associated with the tag. If a semver is specified, the
   * appropriate semver matching logic will be performed or a static version may also
   * be specified. If no version is specified, the version will default to `latest`.
   *
   * When `allVersions` is `false`, the requested metadata will be available under
   * `versions` object with a key corresponding to the user provided version or
   * `latest` if no version was provided.
   *
   * Exmaple:
   * ```
   import RegistryClient from 'package-metadata';
   import * as util from 'util';
   const metadata = await RegistryClient.getMetadata('package-metadata', { version: '^1.0.0' });
   console.log(util.inspect(metadata, { depth: 1 }));
   // >> { name: 'package-metadata', versions: { '^1.0.0': [PackageJson] } }
  ```
   *
   * @param packageName
   * @param options
   */
  public static async getMetadata(packageName: string, options?: MetadataOptions) {
    const opts = Object.assign({ }, DEFAULT_OPTIONS, options);
    const scope = packageName.split('/')[0];
    // Retrieve the current npm configuration
    const npmConfig = buildNpmConfig(scope);
    const packageNameUri = encodeURIComponent(packageName).replace(/^%40/, '@');
    const repo = npmConfig.registry.endsWith('/') ? npmConfig.registry : `${npmConfig.registry}/`;
    const metadataUrl = url.resolve(repo, packageNameUri);

    const proxy = metadataUrl.startsWith('https:') ? npmConfig.proxy.https : npmConfig.proxy.http;
    const metadataType = opts.fullMetadata
      ? 'application/json'
      : 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*';

    const headers: { [key: string]: string; } = {
      accept: metadataType
    };

    const authInfo = buildNpmCredentials(repo);
    if (authInfo != null) {
      headers.authorization = `${authInfo.type} ${authInfo.token}`;
    }

    // @ts-ignore: Not sure why tsc has a problem with this...
    const [err, metadata] = await to(pRequest(metadataUrl, {
      method: 'GET',
      headers:  headers,
      json: true,
      proxy: proxy,
      localAddress: npmConfig.proxy.localAddress,
      strictSSL: npmConfig.ssl.strict,
      cert: npmConfig.ssl.certificate,
      key: npmConfig.ssl.key,
      ca: npmConfig.ssl.ca
    }) as PackageMetadata);

    if (err != null || metadata == null) {
      throw new Error(`Unable to find metadata for package: ${packageName}`);
    }

    if (opts.allVersions || opts.allMetadata) {
      return metadata as PackageMetadata;
    }

    const versionMetadata = findVersionMetadata(opts.version!, metadata);
    if (versionMetadata == null) {
      throw new Error(`Unable to find metadata for version: ${opts.version}`);
    }

    const packageMetadata = {
      name: metadata.name,
      versions: {
        [opts.version!]: versionMetadata
      }
    } as PackageMetadata;

    return packageMetadata;
  }

}

export default RegistryClient;
