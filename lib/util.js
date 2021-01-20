'use strict'

const {
  constants,
  performance,
  monitorEventLoopDelay
} = require('perf_hooks')
const { eventLoopUtilization } = performance
const { NODE_PERFORMANCE_GC_FLAGS_NO } = constants

exports.monitorEventLoopDelaySupported = typeof monitorEventLoopDelay === 'function'
exports.eventLoopUtilizationSupported = typeof eventLoopUtilization === 'function'
exports.resourceUsageSupported = typeof process.resourceUsage === 'function'
exports.gcFlagsSupported = NODE_PERFORMANCE_GC_FLAGS_NO !== undefined
