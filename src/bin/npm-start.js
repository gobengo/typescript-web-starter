/**
 * This script is executed by `npm start`.
 * If NODE_ENV=development, use ts-node to execute straight from /src directory (TypeScript)
 * otherwise, assume `npm run build` has compiled to JS in /lib. Run compiled server.
 */

const childProcess = require('child_process');
const path = require("path")

// execute a script + args in a child process.
// @returns promise of process exit code
function runScript(scriptPath, args=[]) {
  const process = childProcess.fork(scriptPath, args);
  return new Promise((resolve, reject) => {
    process.on('error', reject)
    process.on('exit', resolve)
  })
}

// execute ts-node in a child process
const tsNode = (args=[]) => runScript(path.join(__dirname, "../../node_modules/.bin/ts-node"), args)

const main = async () => {
  const { NODE_ENV } = process.env
  switch (NODE_ENV) {
    case "development":
      tsNode([path.join(__dirname, "./server.ts")])
      break
    default:
      runScript(path.join(__dirname, "../../lib/bin/server.js"))
  }
}

if (require.main === module) {
  main().catch((e) => { throw e })
}
