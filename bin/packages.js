const fs = require('fs')
const path = require('path')
const args = require('./args.js')

const packagesList = []

const walkPath = p => {
  if (p === '/') {
    cli.error('No `package.json` file exists.')
  }
  return fs.existsSync(path.join(p, './package.json')) ? path.join(p, './package.json') : walkPath(path.join(p, '../'))
}

const packages = JSON.parse(fs.readFileSync(walkPath(path.join(path.resolve(), args.path))))

for (let key in packages.dependencies) {
  packagesList.push({name: key, dependency: ''})
}

for (let key in packages.devDependencies) {
  packagesList.push({name: key, dependency: 'dev'})
}

for (let key in packages.peerDependencies) {
  packagesList.push({name: key, dependency: 'peer'})
}

for (let key in packages.optionalDependencies) {
  packagesList.push({name: key, dependency: 'optional'})
}

module.exports = packagesList