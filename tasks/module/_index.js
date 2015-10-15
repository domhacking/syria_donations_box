/*auto-generated*/
var Ractive = require('ractive');

function register() {
  {{#modules}}
  Ractive.components['ui-{{name}}'] = require('./{{file}}');
  {{/modules}}

  return true;
}

module.exports = register();
