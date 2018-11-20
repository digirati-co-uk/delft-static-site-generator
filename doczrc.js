import { postCSSPlugin } from 'docz-plugin-postcss';

module.exports = {
    title: 'TUDelft - Static site generator',
    description: 'This application generates a static site for the Technical University Delft - exhibitions',
    src: './src/',
    dest: './docs/',
    base: '/docs/',
    debug: false,
    port: 5001,
    protocol: 'http',
    plugins: [postCSSPlugin()],
    modifyBundlerConfig: function(config, dev, args) {
      console.log('modifyBundlerConfig', JSON.stringify(config, null, 2));
      return config;
    },
    modifyBabelRc: function(babelrc, args) {
      console.log('modifyBabelRc', JSON.stringify(babelrc, null, 2), args);
      return babelrc;
    }
};