export interface NpmConfig {
  proxy: {
    http?: string;
    https?: string;
    localAddress?: string;
  },
  ssl: {
    certificate?: string;
    key?: string;
    ca?: string;
    strict?: string;
  },
  registry: string;
}

export default NpmConfig;
