import { JestConfigWithTsJest } from "ts-jest";
import config from "./jest.config";

export default {
  ...config,
  collectCoverage: true,
  coverageProvider: "v8",
  collectCoverageFrom: ["**/*.{ts,tsx}"],
  coverageReporters: ["cobertura"],
  testResultsProcessor: "./node_modules/jest-junit-reporter",
} as JestConfigWithTsJest;
