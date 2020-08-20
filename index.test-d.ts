import { expectType, expectError } from 'tsd'
import {
  Doc,
  DocFactory,
  CPUMetric,
  EventLoopDelayMetric,
  GCMetric,
  MemoryMetric
} from '.'

let doc: Doc

// These should work
doc = DocFactory()
doc = DocFactory({})
doc = DocFactory({ sampleInterval: 1234 })
doc = DocFactory({ eventLoopOptions: { resolution: 5678 } })
doc = DocFactory({ collect: { cpu: false, gc: true } })
doc = DocFactory({ collect: { activeHandles: true } })
doc = DocFactory({ collect: { gc: true, activeHandles: true } })

expectType<() => void>(doc.start)
expectType<() => void>(doc.stop)

doc.on('sample', () => {
  expectType<CPUMetric|undefined>(doc.cpu)
  expectType<EventLoopDelayMetric|undefined>(doc.eventLoopDelay)
  expectType<GCMetric|undefined>(doc.gc)
  expectType<MemoryMetric|undefined>(doc.memory)
  expectType<number|undefined>(doc.activeHandles)
})

// These should not
expectError(() => { DocFactory(1) })
expectError(() => { DocFactory('string') })
expectError(() => { DocFactory(null) })
expectError(() => { DocFactory({ foo: 'bar' }) })
expectError(() => { DocFactory({ sampleInterval: 'bar' }) })
expectError(() => { DocFactory({ eventLoopOptions: 'bar' }) })
