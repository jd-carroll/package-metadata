import * as semver from 'semver';
import { PackageMetadata } from './PackageMetadata';

export const findVersionMetadata = (version: string, metadata: PackageMetadata) => {
  const distTag = metadata["dist-tags"]![version];
  if (distTag != null) {
    version = distTag;
  }
  const packageVersions = Object.keys(metadata.versions);
  const semVersion = semver.maxSatisfying(packageVersions, version);
  return metadata.versions[semVersion];
};

export default findVersionMetadata;
