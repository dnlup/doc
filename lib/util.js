'use strict'

const { constants, performance } = require('perf_hooks')
const { eventLoopUtilization } = performance
const { NODE_PERFORMANCE_GC_FLAGS_NO } = constants

exports.eventLoopUtilizationSupported = eventLoopUtilization !== undefined
exports.resourceUsageSupported = typeof process.resourceUsage === 'function'
exports.gcFlagsSupported = NODE_PERFORMANCE_GC_FLAGS_NO !== undefined
