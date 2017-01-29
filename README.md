## Block Dude in JavaScript

Small project to build Block Dude in TypeScript, in the browser.

Uses a Fly because I had those sprites laying around somewhere!

**DEMO** [right here](http://apps.cdroulers.com/block-fly/)

## Other things that should happen

* Fully offline with service workers
* <del>Fully mobile with gestures and zoom in/out, etc.</del>
* Well tested.
* Level chooser.
* Level editor.
* <del>Load custom levels!</del>

# Build and develop

Developed with NodeJS 6.1 (Using `nvm` is recommended!).

    git clone git@github.com:cdroulers/block-fly.git
    npm install
    ./node_modules/.bin/typings install
    npm run start # to get a web server at [http://localhost:5555](http://localhost:5555)
    npm run test -- --watch # to get test to run and re-run anything you rebuild the files.

# Deploying

* Bump version in package.json
* Update [`CHANGELOG.md`](CHANGELOG.md)
* Build production version with `npm run deploy`
* Copy `/build/deploy` to production server.

# Contributing

* Look at [issues](https://github.com/cdroulers/block-fly/issues)
* Create a PR from your fork or branch
* Review, rebase, etc.
* yay!

# Stuff

The web part uses WebPack with hot reload, but nothing hot reloads because I have no idea how it really works.

The tests execute the JS in the `build` folder which is output when `npm run build` is run (or `ctrl+shift+b` in VSCode).
This is because I tried to use `ts-node` for running and it worked, but it wasn't possible to debug the tests that way.

Levels can be seen [here](http://azich.org/blockdude/levels.js).

# Contributors

See [the list](CONTRIBUTORS.md)

# History

See [the changelog](CHANGELOG.md)
