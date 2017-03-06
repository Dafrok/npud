const cli = require('cli')
const path = require('path')

module.exports = cli.parse({
  path: [ 'p', 'Target Node.js project path', 'string', path.resolve()],
  sort: [ 's', 'Sort by datetime `desc` or `asc`', 'string', ''],
  // output: [ 'o', 'Output result', 'string', path.join(path.resolve(), './npud.md')]
})