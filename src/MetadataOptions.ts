/**
 * The available options for `RegistryClient.getMetadata`
 */
export interface MetadataOptions {
  /**
   * @deprecated Please use `allVersions` instead.
   */
  allMetadata?: boolean;
  /**
   * Whether or not to return the metadata on every published version.
   * This flag will superscede any value provided for `versions`.
   * @default false
   */
  allVersions?: boolean;
  /**
   * Whether or not all version related metadata will be included in the response.
   * @default false
   */
  fullMetadata?: boolean;
  /**
   * The package version for which you are requesting metadata. The version
   * may be specified in any of the following forms:
   * - `dist-tag`
   * - semver
   * - version
   * @default 'latest'
   */
  version?: string;
}

export default MetadataOptions;
