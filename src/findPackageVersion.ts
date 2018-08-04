import * as semver from 'semver';
import { PackageMetadata } from './PackageMetadata';

/**
 * Finds the package version corresponding to the version specified.  The
 * version maybe one of the following:
 * - `dist-tag`: The tag label associated with a specific published version
 * - semver: A version following standard semver conventions
 * - static version: An exact version
 *
 * Return `undefined` if no match is found.
 *
 * @param version The version identifier to match
 * @param metadata The available metadata for a package
 * @returns The version metadata or undefined
 */
export const findVersionMetadata = (version: string, metadata: PackageMetadata) => {
  const tags = metadata['dist-tags'];
  if (tags != null && tags[version] != null) {
    version = tags[version];
  }
  const packageVersions = Object.keys(metadata.versions);
  const semVersion = semver.maxSatisfying(packageVersions, version);
  return metadata.versions[semVersion];
};

export default findVersionMetadata;
