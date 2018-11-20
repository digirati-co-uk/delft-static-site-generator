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
    plugins: [postCSSPlugin()]
};