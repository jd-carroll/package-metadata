import * as registryAuth from 'registry-auth-token';

export const buildNpmCredentials = (registryUrl: string): registryAuth.NpmCredentials | undefined => {
  const options = {
    recursive: true
  };

  return registryAuth(registryUrl, options);
};

export default buildNpmCredentials;
