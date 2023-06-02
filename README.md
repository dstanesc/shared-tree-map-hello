# `shared-tree-map` hello world

Demonstrates the use of the `shared-tree-map` package.

## Fluid Relay Env Setup

```bash
export FLUID_MODE=frs
export SECRET_FLUID_RELAY=https://us.fluidrelay.azure.com
export SECRET_FLUID_TOKEN=xyz
export SECRET_FLUID_TENANT=xyz
```

## Tinylicious Env Setup

```bash
export FLUID_MODE=tiny
```

## Start

When using local relay, start the `tinylicious` service

```
npx tinylicious
```

```
npm run clean // optional
npm install
npm run build
npm start
```

## Output

> Note: The dynamic memory plot is present only in browsers supporting `performance.memory.usedJSHeapSize`. At the time of writing, Chrome and Chromium-based browsers support this feature.

![](./img/shared-tree-map-hello.gif)

## Licenses

Licensed under either [Apache 2.0](http://opensource.org/licenses/MIT) or [MIT](http://opensource.org/licenses/MIT) at your option.
