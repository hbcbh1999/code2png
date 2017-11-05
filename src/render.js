const fs = require('fs');
const { resolve } = require('path');
const Mustache = require('mustache');
const Prism = require('prismjs');

const template = `<!DOCTYPE html>
<!-- Generated by code2png; do not edit directly.
   - See: https://github.com/rjz/code2png
   -->
<html>
  <head>
    <meta charset="utf-8" />
    <title>code2png</title>
    {{#styles}}
    <style type="text/css">{{{.}}}</style>
    {{/styles}}
  </head>
  <body>
    <pre>{{{code}}}</pre>
  </body>
</html>`;

const loadFiles = paths => paths.map(p => fs.readFileSync(p, 'utf8'));

module.exports = ({
  code,
  language,
  theme,
}) => {
  const styles = loadFiles([
    'css/default.css',
    `node_modules/prismjs/themes/prism-${theme}.css`,
  ].map(p => resolve(__dirname, `../${p}`)));

  // Phantom truncates box-model whitespace; pad the EOL with cdata instead.
  const paddedCode = code.split('\n').join(' \n');

  return Mustache.render(template, {
    code: Prism.highlight(paddedCode, Prism.languages[language]),
    styles,
  });
};
