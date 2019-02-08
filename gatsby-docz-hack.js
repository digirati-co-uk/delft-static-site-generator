const fs = require('fs');

const GATSBY_NPM_PACKAGE = './node_modules/gatsby/package.json';
const PAGES_JSON_PATH = './node_modules/gatsby/cache-dir/commonjs/pages.json';

// docz including the module, and failing to compile
const rawdata = fs.readFileSync(GATSBY_NPM_PACKAGE);
const gatsbyConf = JSON.parse(rawdata);
if (gatsbyConf.hasOwnProperty('module')) {
  delete gatsbyConf.module;
  fs.writeFileSync(GATSBY_NPM_PACKAGE, JSON.stringify(gatsbyConf, null, 2));
}

// empty pages.json missing from the commonjs version
if (!fs.existsSync(PAGES_JSON_PATH)) {
  fs.writeFileSync(PAGES_JSON_PATH, JSON.stringify([], null, 2));
}
