module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json'
    }
  },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: '(/src/.*\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: [
    'ts',
    'js'
  ]
};
