# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [5.0.3](https://github.com/dnlup/doc/compare/v5.0.2...v5.0.3) (2023-12-18)

### [5.0.2](https://github.com/dnlup/doc/compare/v5.0.1...v5.0.2) (2023-11-09)


### Bug Fixes

* **types:** add missing unref option ([6ad9075](https://github.com/dnlup/doc/commit/6ad9075c4c40487b1ff166c6466842158c5a767a))

### [5.0.1](https://github.com/dnlup/doc/compare/v5.0.0...v5.0.1) (2023-11-02)


### Bug Fixes

* **types:** fix exports ([a62f988](https://github.com/dnlup/doc/commit/a62f9886285cbe2fbb8fe383a2467d18c5c7005a))

## [5.0.0](https://github.com/dnlup/doc/compare/v4.0.1...v5.0.0) (2023-11-02)


### ⚠ BREAKING CHANGES

* minimum Node.js version supported is 18

### Features

* add diagnostics channel support ([97ca4b4](https://github.com/dnlup/doc/commit/97ca4b4233934ecc90d9a06ae17102c44b474d4e)), closes [#579](https://github.com/dnlup/doc/issues/579)
* use node histogram ([eb20316](https://github.com/dnlup/doc/commit/eb20316d1e58e3cd4818b15756d6477ee0efb72a)), closes [#442](https://github.com/dnlup/doc/issues/442)


### Bug Fixes

* fix types and remove dead code ([abdfbee](https://github.com/dnlup/doc/commit/abdfbee551bc3cb8f16d7579275a2ce22741984d))
* **gc:** compute to zero nan values ([ebd33a0](https://github.com/dnlup/doc/commit/ebd33a00c164ef15b17af97e728ade48ca845274))
* remove deprecation notice ([60d6f09](https://github.com/dnlup/doc/commit/60d6f09eac7fb8002e285012f16ca329303f9265))
* **types:** fix exported types ([410bbf0](https://github.com/dnlup/doc/commit/410bbf0c19634a971316586e4ab460d9e9717125))


* drop older node versions ([70fa43d](https://github.com/dnlup/doc/commit/70fa43dc7fcaf84532a88f7b41403252ee3186c0))

### [4.0.1](https://github.com/dnlup/doc/compare/v4.0.0...v4.0.1) (2021-03-17)


### Bug Fixes

* export errors ([e0d49a2](https://github.com/dnlup/doc/commit/e0d49a210beb5e493ba49d9a787b02dbf1cceedd))

## [4.0.0](https://github.com/dnlup/doc/compare/v4.0.0-3...v4.0.0) (2021-03-16)

## [4.0.0-3](https://github.com/dnlup/doc/compare/v4.0.0-2...v4.0.0-3) (2021-03-15)


### Features

* add esm support ([e965b97](https://github.com/dnlup/doc/commit/e965b975052a23f0d473f470ea020f131a8861d7))
* **eventlooputilization:** expose single metrics ([3fca137](https://github.com/dnlup/doc/commit/3fca137d0e1af89d15cc0eaf37e93fadb96a1a2f))

## [4.0.0-2](https://github.com/dnlup/doc/compare/v4.0.0-1...v4.0.0-2) (2021-03-14)


### Bug Fixes

* **gc:** add start and stop ([300737d](https://github.com/dnlup/doc/commit/300737deca0036de6b4d566767241bae8c49e202))

## [4.0.0-1](https://github.com/dnlup/doc/compare/v4.0.0-0...v4.0.0-1) (2021-03-13)


### ⚠ BREAKING CHANGES

* **config:** the option `eventLoopOptions` has been replaced by
`eventLoopDelayOptions`.

### Bug Fixes

* **config:** rename eventLoopOptions ([289b10d](https://github.com/dnlup/doc/commit/289b10d666b0a00b3dac97aac8489134cbf9e7de))

## [4.0.0-0](https://github.com/dnlup/doc/compare/v3.1.0...v4.0.0-0) (2021-03-13)


### ⚠ BREAKING CHANGES

* **gc:** the gc stats are completely different now and there are 2 new options for its initialization. The types definitions changes reflect this too.

### Features

* **gc:** use histogramjs ([fe7731a](https://github.com/dnlup/doc/commit/fe7731a3c4e545bbf204aea857a3cbb19d6711d1))

## [3.1.0](https://github.com/dnlup/doc/compare/v3.0.3...v3.1.0) (2021-01-11)


### Features

* add support flags ([3d0fd39](https://github.com/dnlup/doc/commit/3d0fd396817fa1f06ddcfc161d2ac37dc0327121))

### [3.0.3](https://github.com/dnlup/doc/compare/v3.0.2...v3.0.3) (2020-11-10)

### [3.0.2](https://github.com/dnlup/doc/compare/v3.0.1...v3.0.2) (2020-10-28)

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
