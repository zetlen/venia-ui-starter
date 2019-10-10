const path = require("path");
const veniaConfig = require("./webpack.venia.config.js");

module.exports = async function veniaUiStarterConfig(...args) {
  const config = await veniaConfig(...args);

  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  config.resolve.alias["@magento/venia-ui"] = path.resolve(
    __dirname,
    "src",
    "@magento",
    "venia-ui"
  );

  return config;
};
