
// CSS deps
/**
  * Webpack will take care of creating a bundled stylesheet
  * out of these files in addition to any .scss/.css files required
  * in any other app component
**/

require('styles/normalize.scss');
require('styles/base.scss');

const Analyzer = require('./components/Analyzer');
const h = require('./helpers');

// remove the no-js class name on the html tag
h.jsEnabled();

// render the app!
Analyzer.render();