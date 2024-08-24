import names from "all-the-package-names" with { type: "json" };
import { readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';
import childProcess from 'child_process';
const exec = promisify(childProcess.exec);

const NUM_DEPS = 20;
let manifest = JSON.parse(readFileSync('package.json', 'utf8'));

console.log('start');
let n = 0;
for(let i = 0; i < names.length; i++) {
    if (n >= NUM_DEPS) break;

    let name = names[i];
    if (Object.keys(manifest.dependencies).includes(name)) {
        continue;
    }

    let version = '>=0.0.0';
    console.log(`${n}:  start ${name}: ${version}`);
    manifest.dependencies[name] = version;
    writeFileSync('package.json', JSON.stringify(manifest));
    try {
        await exec('yarn install');
        await exec('yarn install --frozen-lockfile --non-interactive')
    } catch (err) {
        console.error(`error with ${name}`)
        delete manifest.dependencies[name];
        writeFileSync('package.json', JSON.stringify(manifest));
        continue;
    }
    console.log(`${n}: finish ${name}: ${version}`);
    n++;
}
console.log('end');
