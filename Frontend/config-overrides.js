const path = require('path');
const {override,  addLessLoader} = require('customize-cra');



const overrideProcessEnv = value => config => {
  config.resolve.modules = [
    path.join(__dirname, 'src')
  ].concat(config.resolve.modules);
  return config;
};

module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      //'@primary-color': '#038fde',
      '@primary-color': '#5fb2a2'
    }
  }),
  overrideProcessEnv({
    VERSION: JSON.stringify(require('./package.json').version),
  })
);
