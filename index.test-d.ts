import { expectType, expectError, expectAssignable } from 'tsd'
import {
  createSampler,
  Sampler,
  errors,
  CPUMetric,
  ResourceUsageMetric,
  EventLoopDelayMetric,
  EventLoopUtilizationMetric,
  GCMetric
} from '.'

expectAssignable<errors.NotSupportedError>(new errors.NotSupportedError())
expectAssignable<'NotSupportedError'>(new errors.NotSupportedError().name)
expectAssignable<'DOC_ERR_NOT_SUPPORTED'>(new errors.NotSupportedError().code)
expectAssignable<errors.InvalidArgumentError>(new errors.InvalidArgumentError())
expectAssignable<'InvalidArgumentError'>(new errors.InvalidArgumentError().name)
expectAssignable<'DOC_ERR_INVALID_ARG'>(new errors.InvalidArgumentError().code)

let sampler: Sampler

// These should work
sampler = createSampler()
sampler = createSampler({})
sampler = createSampler({ sampleInterval: 1234 })
sampler = createSampler({ eventLoopDelayOptions: { resolution: 5678 } })
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
  expectType<NodeJS.MemoryUsage|undefined>(sampler.memory)
  expectType<number|undefined>(sampler.activeHandles)
})

// These should not
expectError(() => { createSampler(1) })
expectError(() => { createSampler('string') })
expectError(() => { createSampler(null) })
expectError(() => { createSampler({ foo: 'bar' }) })
expectError(() => { createSampler({ sampleInterval: 'bar' }) })
expectError(() => { createSampler({ eventLoopDelayOptions: 'bar' }) })
