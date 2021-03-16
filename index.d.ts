import { Sampler, SamplerOptions } from './types/sampler'
import errors = require('./types/errors')

declare function createSampler(options?: SamplerOptions): Sampler
export default createSampler

export { createSampler }
export const eventLoopUtilizationSupported: Boolean
export const resourceUsageSupported: Boolean
export const gcFlagsSupported: Boolean
export { Sampler, SamplerOptions }
export { errors }
export * from './types/cpuMetric'
export * from './types/eventLoopDelayMetric'
export * from './types/resourceUsageMetric'
export * from './types/eventLoopUtilizationMetric'
export * from './types/gcMetric'
