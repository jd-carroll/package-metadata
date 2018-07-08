import { PackageJson } from './PackageJson';

export interface PackageMetadata {
  name: string;
  'dist-tags'?: {
    [key: string]: string;
  };
  modified?: string;
  versions: {
    [key: string]: PackageJson;
  }
}

export default PackageMetadata;
