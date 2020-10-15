import { expectType, expectError } from 'tsd'
import {
  Sampler,
  createSampler,
  CPUMetric,
  ResourceUsageMetric,
  EventLoopDelayMetric,
  EventLoopUtilizationMetric,
  GCMetric,
  MemoryMetric
} from '.'

let sampler: Sampler

// These should work
sampler = createSampler()
sampler = createSampler({})
sampler = createSampler({ sampleInterval: 1234 })
sampler = createSampler({ eventLoopOptions: { resolution: 5678 } })
sampler = createSampler({ collect: { cpu: false, gc: true } })
sampler = createSampler({ collect: { activeHandles: true } })
sampler = createSampler({ collect: { gc: true, activeHandles: true } })

expectType<() => void>(sampler.start)
expectType<() => void>(sampler.stop)

sampler.on('sample', () => {
  expectType<CPUMetric|undefined>(sampler.cpu)
  expectType<ResourceUsageMetric|undefined>(sampler.resourceUsage)
  expectType<EventLoopDelayMetric|undefined>(sampler.eventLoopDelay)
  expectType<EventLoopUtilizationMetric|undefined>(sampler.eventLoopUtilization)
  expectType<GCMetric|undefined>(sampler.gc)
  expectType<MemoryMetric|undefined>(sampler.memory)
  expectType<number|undefined>(sampler.activeHandles)
})

// These should not
expectError(() => { createSampler(1) })
expectError(() => { createSampler('string') })
expectError(() => { createSampler(null) })
expectError(() => { createSampler({ foo: 'bar' }) })
expectError(() => { createSampler({ sampleInterval: 'bar' }) })
expectError(() => { createSampler({ eventLoopOptions: 'bar' }) })
