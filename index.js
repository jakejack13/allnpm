const names = require("all-the-package-names")
var fs = require('fs');

let manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('start');
names.forEach(name => {
    let version = '*';
    manifest.dependencies[name] = version;
    console.log(`${name}: ${version}`);
});
console.log('end');

fs.writeFile('package.json', JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('done');
});
