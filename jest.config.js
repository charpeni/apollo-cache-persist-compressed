/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '.ts': [
      'ts-jest',
      {
        isolatedModules: true,
        useESM: true,
      },
    ],
  },
};
