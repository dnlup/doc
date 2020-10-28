# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.0](https://github.com/dnlup/doc/compare/v1.0.1...v4.0.0) (2020-10-28)


### ⚠ BREAKING CHANGES

* **config:** message errors and instances are changed.
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

* **config:** add JSON schema validator ([9dec7f4](https://github.com/dnlup/doc/commit/9dec7f40cea86572f1487b66ee31060e66bfd4e6))
* **config:** allow selection of metrics to collect ([074e1a8](https://github.com/dnlup/doc/commit/074e1a8a3efbd894791a0ec280ce05cd9a8cd213))
* **cpu:** attach cpu state to doc instance ([c58f666](https://github.com/dnlup/doc/commit/c58f666190a0198c990783131a68c680ca00405d))
* **eventLoopDelay:** attach object to doc instance ([99b1ba0](https://github.com/dnlup/doc/commit/99b1ba0d21b647241bf54b5a13442fd34c98dbc6))
* **eventLoopDelay:** expose compute method ([c1f0a7c](https://github.com/dnlup/doc/commit/c1f0a7c9ff00801712c701e47b847b97db5c4af3))
* **gc:** attach metric to doc instance ([632576f](https://github.com/dnlup/doc/commit/632576ff460ef80581948b44dcc7ee0cad067091))
* **sampler:** add event loop utilization metric ([6a0c73b](https://github.com/dnlup/doc/commit/6a0c73b673971dcd259c0e6b310e0989fb8efe9a))
* **sampler:** add resourceUsage metric ([a175456](https://github.com/dnlup/doc/commit/a175456cb732daf2eaf4ecf9311715f38d45aac2))
* **types:** add resourceUsage types ([8ff4f40](https://github.com/dnlup/doc/commit/8ff4f40eff2174ac6a2dc9009c3dfe40dcd5d1a1))
* **types:** use NodeJS types where possible ([31254c9](https://github.com/dnlup/doc/commit/31254c955de7089d9abac715dcc5ac06b9257630))
* add activeHandles metric ([89e5ed3](https://github.com/dnlup/doc/commit/89e5ed3333d3f22d0a85122ac7020c534bfb1085))
* add activeHandles metric ([2ac78b6](https://github.com/dnlup/doc/commit/2ac78b6ff7a118357a64a05911b07f65e8444adf))
* add TypeScript typings file ([c7cb7b6](https://github.com/dnlup/doc/commit/c7cb7b66d36ed8bc14bf803a80bb29a9236f64a0))
* attach remaining metrics and add start options ([d244da5](https://github.com/dnlup/doc/commit/d244da5e66b555c4f2ce175f439cc468f78af5fc))
* improve gc metric ([f82ffc3](https://github.com/dnlup/doc/commit/f82ffc3bc50d08e16bb769a6b3c55d0caaff50bf))
* use PerformanceObserver for gc stats ([f6f1e67](https://github.com/dnlup/doc/commit/f6f1e67b0a1cfb2ed06e8f9a719b3e1902f0af33))


### Bug Fixes

* **config:** drop ajv-cli and build step ([790df94](https://github.com/dnlup/doc/commit/790df94620239fd12316d2e11e2b455dcbfff9c8))
* **config:** fix number validation ([0cc9146](https://github.com/dnlup/doc/commit/0cc91460c3a8b3f3965d356721575bd7d64cc5dd))
* **eventLoopDelay:** use Symbol for sample method ([0ba20eb](https://github.com/dnlup/doc/commit/0ba20eb55405ac34914639901d34c041323ebace))
* **gc:** use symbols for GCAggregatedEntry methods ([f0a43d5](https://github.com/dnlup/doc/commit/f0a43d50497be2b08ace38aac02f45df91825878))
* **lib:** fix wrong name used for options symbol ([3cd64ee](https://github.com/dnlup/doc/commit/3cd64eefb8ed4dfdbcdfd70f1723e741b0824eb2))
* **sampler:** exit if timer is initialized on `start` ([2014d47](https://github.com/dnlup/doc/commit/2014d471f93adbba84e222aaa74a70659c023560))
* **sampler:** pass options from kOptions ([a7b6b92](https://github.com/dnlup/doc/commit/a7b6b92b0be292e946975460a697f3f7ba690450))
* **types:** add default property to module.exports ([1b5d7ca](https://github.com/dnlup/doc/commit/1b5d7cafb43dc0952ee0badad2b5e96d92986dcd))
* **types:** remove undefined from gc stats ([8d59f67](https://github.com/dnlup/doc/commit/8d59f67062d4474b568a3a16ccb5e464206f5578))
* **types:** use camel case for enum and use jsdoc ([0c50b4c](https://github.com/dnlup/doc/commit/0c50b4cec49434ac2eddb30c2cfaaf32872281a8))
* fix cpu percentage ([57d535f](https://github.com/dnlup/doc/commit/57d535f3d28e27383a0cb55d936856d346a8bfd3))
* gc types are number | undefined ([6f4d269](https://github.com/dnlup/doc/commit/6f4d26975f2f51b54b38189c0fafd24ce09d14bb))
* include typings file when published ([6aa935c](https://github.com/dnlup/doc/commit/6aa935ce46ec1314b5521b8b758832fafdf976f7))
* split gc into separate file to make testing easier ([2158bd9](https://github.com/dnlup/doc/commit/2158bd96c7cdb6e87760295407d893849a8b2b0b))


* rename Doc to Sampler and move it to lib ([3a8da17](https://github.com/dnlup/doc/commit/3a8da17d8d8d552d48fd5b30a9bd0ee5aecd0ccc))
* **types:** remove Doc namespace ([391d0fb](https://github.com/dnlup/doc/commit/391d0fb425b6eff8f9c975401fdd103997a2f0e5))

### [3.0.1](https://github.com/dnlup/doc/compare/v3.0.0...v3.0.1) (2020-10-23)

## [3.0.0](https://github.com/dnlup/doc/compare/v2.0.2...v3.0.0) (2020-10-23)


### ⚠ BREAKING CHANGES

* **config:** message errors and instances are changed.

### Features

* **sampler:** add event loop utilization metric ([43243db](https://github.com/dnlup/doc/commit/43243db33b6ee6b1c24da2f51489d3a5f072602f))
* **sampler:** add resourceUsage metric ([f83c1e8](https://github.com/dnlup/doc/commit/f83c1e885c0be448c1debeb68c4a46deac8b9a86))
* **types:** add resourceUsage types ([4e1e01c](https://github.com/dnlup/doc/commit/4e1e01ced353d9de0f70a5e58c862e84f38113c1))
* **types:** use NodeJS types where possible ([b7148f1](https://github.com/dnlup/doc/commit/b7148f1b8f573baa8792603efddfc89f383b8e07))


### Bug Fixes

* **config:** drop ajv-cli and build step ([b143d15](https://github.com/dnlup/doc/commit/b143d153b1df55d4e32770696491b2e7b5c31205))


### [2.0.2](https://github.com/dnlup/doc/compare/v2.0.1...v2.0.2) (2020-10-04)


### Bug Fixes

* **symbols:** fix typo ([d5f39b4](https://github.com/dnlup/doc/commit/d5f39b4f2d946c57200fda063da47e4e9c3cb5f7))

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
