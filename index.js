import names from "all-the-package-names" with { type: "json" };
import { readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';
import childProcess from 'child_process';
const exec = promisify(childProcess.exec);


let manifest = JSON.parse(readFileSync('package.json', 'utf8'));

console.log('start');
for(let i = 0; i < names.length; i++) {
    let name = names[i];
    let version = '*';
    console.log(`start ${name}: ${version}`);
    manifest.dependencies[name] = version;
    writeFileSync('package.json', JSON.stringify(manifest));
    try {
        await exec('yarn install');
    } catch (err) {
        delete manifest.dependencies[name];
    }
    console.log(`finish ${name}: ${version}`);
}
console.log('end');
