# typescript-web-starter

A simple website project written in TypeScript. Use this as a starting point for your project.

Save yourself some time. Launch sooner.

## Features

* [React](https://reactjs.org) for view composition
* [Material UI](https://material-ui.com/) react components for common UI elements like buttons, grid, etc. Type-checked.
* client-side state management with [Redux](https://redux.js.org/)
* web server using [koa](https://koajs.com/)
* server side rendering (SSR) - Faster apparent page loads + your website will load for end-users without JavaScript.
* [Hot Module Replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/) - When running the web server with NODE_ENV=development, saving any file (e.g. a React Component) will instantly reload and re-render your app.
* Testing:
  * Convention to be able to run any test file (or all) using [./src/test/cli](./src/test/cli). No magic tests runner CLIs
  * Tests are type-checked, thanks to [alsatian-test](https://github.com/alsatian-test/alsatian)
* VS Code Project
  * Debug projects in VS Code GUI with ts-node launcher
* [prettier](https://prettier.io/) - standard code formatting
* [tslint](https://palantir.github.io/tslint/) - Consistent coding practices, enforced.

## Usage

1. Fork or clone this repository.
2. `npm install` - to download dependencies

* dev mode (HMR enabled): `npm run dev`
  * or `NODE_ENV=development npm start`
* build assets for production: `npm run build`
  * TypeScript -> JavaScript output goes in [./lib/](./lib/)
  * Minfied JavaScript for web browser goes in [./dist/](./dist/)
* production mode
  * first, compile JS to be loaded in the browser: `npm run build`
  * `npm start`
* test: `npm test`
* tslint: `npm run tslint`
* prettier: `npm run prettier`
