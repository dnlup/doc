import { strictEqual } from 'assert'
import { doc, Sampler, errors, eventLoopUtilizationSupported, resourceUsageSupported, gcFlagsSupported } from '../../index.js'

strictEqual(typeof doc, 'function')
strictEqual(typeof Sampler, 'function')
strictEqual(typeof errors, 'object')
strictEqual(typeof eventLoopUtilizationSupported, 'boolean')
strictEqual(typeof resourceUsageSupported, 'boolean')
strictEqual(typeof gcFlagsSupported, 'boolean')
