import { EventEmitter } from 'events'
import { CPUMetric } from './types/cpuMetric'
import { EventLoopDelayMetric } from './types/eventLoopDelayMetric'
import { ResourceUsageMetric } from './types/resourceUsageMetric'
import { EventLoopUtilizationMetric } from './types/eventLoopUtilizationMetric'
import { GCMetric } from './types/gcMetric'

declare interface SamplerOptions {
  /**
   * Sample interval (ms), each sampleInterval ms a data event is emitted.
   * On Node 10 the default value is 500 while on Node >= 12 is 1000.
   * Under the hood the package uses monitorEventLoopDelay where available to
   * sample the event loop and this allows to increase the default sample
   * interval on Node >= 12.
   */
  sampleInterval?: number,

  /**
   * Options to setup `perf_hooks.monitorEventLoopDelay`.
   */
  eventLoopOptions?: {
    /**
     * The sampling rate in milliseconds. Must be greater than zero and than the sampleInterval. Default: 10.
     */
    resolution: number,
  }
  /**
    * Enable/disable specific metrics
    */
  collect?: {
    cpu?: boolean,
    resourceUsage?: boolean,
    eventLoopDelay?: boolean,
    eventLoopUtilization?: boolean,
    memory?: boolean,
    gc?: boolean,
    activeHandles?: boolean
  }
}

declare interface MemoryMetric extends NodeJS.MemoryUsage {}

declare class Sampler extends EventEmitter {
  cpu?: CPUMetric
  resourceUsage?: ResourceUsageMetric
  eventLoopDelay?: EventLoopDelayMetric
  eventLoopUtilization?: EventLoopUtilizationMetric
  gc?: GCMetric
  memory?: MemoryMetric
  activeHandles?: number
  on(event: 'sample', listener: () => void): this
  start(): void
  stop(): void
}

declare function createSampler(options?: SamplerOptions): Sampler

export default createSampler

export {
  Sampler,
  SamplerOptions,
  createSampler,
  CPUMetric,
  ResourceUsageMetric,
  EventLoopDelayMetric,
  EventLoopUtilizationMetric,
  GCMetric,
  MemoryMetric
}
