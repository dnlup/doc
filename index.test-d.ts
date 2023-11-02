import { expectType, expectError, expectAssignable } from 'tsd'
import doc, { 
  errors,
  Sampler,
  CPUMetric,
  ResourceUsageMetric,
  EventLoopDelayMetric,
  EventLoopUtilizationMetric,
  GCMetric
 } from '.'
 
expectAssignable<errors.InvalidArgumentError>(new errors.InvalidArgumentError())
expectAssignable<'InvalidArgumentError'>(new errors.InvalidArgumentError().name)
expectAssignable<'DOC_ERR_INVALID_ARG'>(new errors.InvalidArgumentError().code)

let sampler: Sampler

// These should work
sampler = doc()
sampler = doc({})
sampler = doc({ sampleInterval: 1234 })
sampler = doc({ eventLoopDelayOptions: { resolution: 5678 } })
sampler = doc({ collect: { cpu: false, gc: true } })
sampler = doc({ collect: { activeHandles: true } })
sampler = doc({ collect: { gc: true, activeHandles: true } })

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
expectError(() => { doc(1) })
expectError(() => { doc('string') })
expectError(() => { doc(null) })
expectError(() => { doc({ foo: 'bar' }) })
expectError(() => { doc({ sampleInterval: 'bar' }) })
expectError(() => { doc({ eventLoopDelayOptions: 'bar' }) })
