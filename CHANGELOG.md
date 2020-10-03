# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.1](https://github.com/dnlup/doc/compare/v2.0.0...v2.0.1) (2020-10-03)


### Bug Fixes

* **sampler:** pass options from kOptions ([90fddd7](https://github.com/dnlup/doc/commit/90fddd765ff4163b21d8802923e26d415e6e1163))

## [2.0.0](https://github.com/dnlup/doc/compare/v1.2.0-0...v2.0.0) (2020-09-22)


### ⚠ BREAKING CHANGES

* the exported class is named Sampler and not Doc anymore
* **types:** types are not accessible using `Doc.` notation.
`DocInstance` has been renamed to `Doc` and declared as a class.
* **gc:** the metric is not exposed to the event handler anymore,
but it is attached directly to the Doc instance.
* **eventLoopDelay:** the eventLoopDelay metric is not exposed anymore to the
event handler, but it is attached to the Doc instance.
* **cpu:** the cpu metric is not exposed anymore to the
event handler, but it is attached to the Doc instance. The event name is
changed from `data` to `sample`.

### Features

* **eventLoopDelay:** expose compute method ([928670f](https://github.com/dnlup/doc/commit/928670f5a7f8989e62484d78fd18f80b1b135b3b))
* attach remaining metrics and add start options ([a5945cd](https://github.com/dnlup/doc/commit/a5945cd94202bc3ea31dbe55a9bb64e87036f5cd))
* **config:** add JSON schema validator ([4efdedd](https://github.com/dnlup/doc/commit/4efdeddf20be807f077d0336765c244b4e195a19))
* **config:** allow selection of metrics to collect ([89619a0](https://github.com/dnlup/doc/commit/89619a0c24e8099a373a97a524ea5cd2bcb3e608))
* **cpu:** attach cpu state to doc instance ([479e095](https://github.com/dnlup/doc/commit/479e09545a8a7fd7184196599b2c3f1174959d16))
* **eventLoopDelay:** attach object to doc instance ([85d7b20](https://github.com/dnlup/doc/commit/85d7b201ca93bcfd3f2dc54508f8d82935c2a81e))
* **gc:** attach metric to doc instance ([ac516d9](https://github.com/dnlup/doc/commit/ac516d9ada68ec018ba804201023b588f4da5c42))
* add activeHandles metric ([59d0710](https://github.com/dnlup/doc/commit/59d0710274c53960159a18521cf39c0c79a1cd56))
* add activeHandles metric ([1676e68](https://github.com/dnlup/doc/commit/1676e68335473629310b9c7f9e9e5281f89f9691))
* improve gc metric ([ea77ea7](https://github.com/dnlup/doc/commit/ea77ea7f0b8835b1fa05c67f0fcd576e005bdb7d))


### Bug Fixes

* **eventLoopDelay:** use Symbol for sample method ([d4021e0](https://github.com/dnlup/doc/commit/d4021e0d3b4a9115e8fb1b642c89111e0561fdda))
* **gc:** use symbols for GCAggregatedEntry methods ([356b37a](https://github.com/dnlup/doc/commit/356b37a18209fd555a6904f5e1f1dc1502a41e90))
* **lib:** fix wrong name used for options symbol ([865ba82](https://github.com/dnlup/doc/commit/865ba82a8b851f22c51108d90e3dde65ca25e3b9))
* **sampler:** exit if timer is initialized on `start` ([408b1b3](https://github.com/dnlup/doc/commit/408b1b3291e0803713978e5abc636732d0a98407))
* **types:** remove undefined from gc stats ([289d252](https://github.com/dnlup/doc/commit/289d252a8f51b8a148314cdf9178128a81894afd))
* **types:** use camel case for enum and use jsdoc ([f90bd60](https://github.com/dnlup/doc/commit/f90bd6065364b4126f1eb2d7c8fe7a88f2d005c7))


* rename Doc to Sampler and move it to lib ([2ed25ab](https://github.com/dnlup/doc/commit/2ed25ab940e35f55d2a3aad70ad92bf7b4affe5d))
* **types:** remove Doc namespace ([4a3ecc2](https://github.com/dnlup/doc/commit/4a3ecc2c568a281c33e90fe3083750e884265fc1))

## [1.2.0-0](https://github.com/dnlup/doc/compare/v1.1.0...v1.2.0-0) (2020-07-03)


### Features

* use PerformanceObserver for gc stats ([fae15d2](https://github.com/dnlup/doc/commit/fae15d27ec041173ab709a707c5cce2d7740562d))


### Bug Fixes

* gc types are number | undefined ([fae1cf4](https://github.com/dnlup/doc/commit/fae1cf4a4ff6ca32f0cc4771265564156954a65e))
* split gc into separate file to make testing easier ([fae108f](https://github.com/dnlup/doc/commit/fae108f0a528015efeaf78ab42c60c247a36e0b9))

## [1.1.0](https://github.com/dnlup/doc/compare/v1.0.4-0...v1.1.0) (2020-06-30)


### Features

* add TypeScript typings file ([fae1f3b](https://github.com/dnlup/doc/commit/fae1f3bf5429881b416fd52ddeddf2a91dee52f6))


### Bug Fixes

* include typings file when published ([fae1012](https://github.com/dnlup/doc/commit/fae1012cbc7629ca0310e0a551c2c9f86036d41e))

### [1.0.4-0](https://github.com/dnlup/doc/compare/v1.0.3...v1.0.4-0) (2020-06-12)

### [1.0.3](https://github.com/dnlup/doc/compare/v1.0.2...v1.0.3) (2020-05-25)

### [1.0.2](https://github.com/dnlup/doc/compare/v1.0.1...v1.0.2) (2020-03-31)


### Bug Fixes

* fix cpu percentage ([57d535f](https://github.com/dnlup/doc/commit/57d535f3d28e27383a0cb55d936856d346a8bfd3))

### 1.0.1 (2020-03-30)
