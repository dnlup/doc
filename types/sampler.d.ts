import { EventEmitter } from 'events'
import { CPUMetric } from './cpuMetric'
import { EventLoopDelayMetric } from './eventLoopDelayMetric'
import { ResourceUsageMetric } from './resourceUsageMetric'
import { EventLoopUtilizationMetric } from './eventLoopUtilizationMetric'
import { GCMetric, GCMetricOptions } from './gcMetric'

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
   * Garbage collection metric options
   */
  gcOptions?: GCMetricOptions,

  /**
   * Options to setup `perf_hooks.monitorEventLoopDelay`.
   */
  eventLoopDelayOptions?: {
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

export class Sampler extends EventEmitter {
  constructor(options?: SamplerOptions)
  cpu?: CPUMetric
  resourceUsage?: ResourceUsageMetric
  eventLoopDelay?: EventLoopDelayMetric
  eventLoopUtilization?: EventLoopUtilizationMetric
  gc?: GCMetric
  memory?: NodeJS.MemoryUsage
  activeHandles?: number
  on(event: 'sample', listener: () => void): this
  start(): void
  stop(): void
}
