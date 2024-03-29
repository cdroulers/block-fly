export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: ".+/.*.spec.ts$",
  moduleNameMapper: {
    //"\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__ mocks __/fileMock.js",
  },
  testPathIgnorePatterns: ["/test/e2e/", "/test/playwright/"],
};
