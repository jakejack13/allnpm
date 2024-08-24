const names = require("all-the-package-names")
var fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


let manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('start');
names.forEach(async name => {
    let version = '*';
    console.log(`start ${name}: ${version}`);
    manifest.dependencies[name] = version;
    fs.writeFileSync('package.json', JSON.stringify(manifest));
    try {
        await exec('yarn install');
    } catch (err) {
        delete manifest.dependencies[name];
    }
    console.log(`finish ${name}: ${version}`);
});
console.log('end');
