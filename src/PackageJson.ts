export interface PackageJson {
  name: string;
  version: string;
  _hasShrinkwrap?: boolean;
  bin?: any;
  directories?: any;
  dist?: {
    integrity: string;
    shasum: string;
    tarball: string;
    fileCount: number;
    unpackedSize: number;
    'npm-signatire': string;
  };
  engines?: {
    [key: string]: string;
  };
  dependencies?: {
    [key: string]: string;
  };
  devDependencies?: {
    [key: string]: string;
  };
  [key: string]: any;
}

export default PackageJson;
