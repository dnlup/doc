import { strictEqual } from 'assert'
import { doc, Sampler, eventLoopUtilizationSupported, resourceUsageSupported, gcFlagsSupported } from '../../index.js'

strictEqual(typeof doc, 'function')
strictEqual(typeof Sampler, 'function')
strictEqual(typeof eventLoopUtilizationSupported, 'boolean')
strictEqual(typeof resourceUsageSupported, 'boolean')
strictEqual(typeof gcFlagsSupported, 'boolean')
