const defaultConfig = require("./.testcaferc.cjs");
module.exports = {
  ...defaultConfig,
  appCommand: "npm run dev",
  appInitDelay: 10000,
};
