import { Sampler, SamplerOptions } from './types/sampler'
import errors from './types/errors'
import { CPUMetric } from './types/cpuMetric'
import { EventLoopDelayMetric } from './types/eventLoopDelayMetric'
import { ResourceUsageMetric } from './types/resourceUsageMetric'
import { EventLoopUtilizationMetric } from './types/eventLoopUtilizationMetric'
import { GCEntry, GCAggregatedEntry, GCMetric } from './types/gcMetric'

declare module 'doc' {

}
declare namespace doc {
  export { errors }
  export type {
    Sampler, SamplerOptions,
    CPUMetric,
    EventLoopDelayMetric,
    ResourceUsageMetric,
    EventLoopUtilizationMetric,
    GCEntry, GCAggregatedEntry, GCMetric
  }
  export const createSampler: (options?: SamplerOptions) => Sampler
  export { createSampler as default }
}
declare function doc(options?: doc.SamplerOptions): doc.Sampler
export = doc
