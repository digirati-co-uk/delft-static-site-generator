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
  modifyBabelRc: function (config) {
    const projectFolder = config.presets[0][0].split('/node_modules/')[0];
    config.presets = [
      [
        projectFolder + '/node_modules/babel-preset-gatsby/index.js',
        {
          targets: {
            browsers: [">0.25%", "not dead"],
          },
        },
      ],
    ].concat(config.presets);
    config.plugins.push(projectFolder + '/node_modules/babel-plugin-remove-graphql-queries/index.js');
    return config;
  }  
};