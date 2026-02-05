var fs = require('fs');
var path = require('path');

var dist = path.join(__dirname, 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

// JS: src/pixel-grid.js already has animations bundled
fs.copyFileSync(
  path.join(__dirname, 'src', 'pixel-grid.js'),
  path.join(dist, 'pixel-grid.js')
);

// CSS: core only
fs.copyFileSync(
  path.join(__dirname, 'css', 'pixel-grid.css'),
  path.join(dist, 'pixel-grid.css')
);

// CSS: core + colors combined
var core = fs.readFileSync(path.join(__dirname, 'css', 'pixel-grid.css'), 'utf8');
var colors = fs.readFileSync(path.join(__dirname, 'css', 'colors.css'), 'utf8');
fs.writeFileSync(
  path.join(dist, 'pixel-grid.full.css'),
  core + '\n' + colors
);

console.log('Built dist/pixel-grid.js');
console.log('Built dist/pixel-grid.css');
console.log('Built dist/pixel-grid.full.css');
