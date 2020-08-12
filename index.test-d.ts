import { expectType, expectError } from 'tsd'
import Doc = require('.');

let doc: Doc.DocInstance

// These should work
doc = Doc()
doc = Doc({})
doc = Doc({ sampleInterval: 1234 })
doc = Doc({ eventLoopOptions: { resolution: 5678 } })
doc = Doc({ collect: { cpu: false, gc: true } })
doc = Doc({ collect: { activeHandles: true } })
doc = Doc({ collect: { gc: true, activeHandles: true } })
doc.on('data', data => {
  expectType<number>(data.cpu)
  expectType<number>(data.eventLoopDelay)
  expectType<number>(data.memory.external)
  expectType<number>(data.memory.heapTotal)
  expectType<number>(data.memory.heapUsed)
  expectType<number>(data.memory.rss)
  expectType<Doc.GCAggregatedEntry|undefined>(data.gc.get(Doc.GCOp.major))
  expectType<Doc.GCAggregatedEntry|undefined>(data.gc.get(Doc.GCOp.minor))
  expectType<Doc.GCAggregatedEntry|undefined>(data.gc.get(Doc.GCOp.incremental))
  expectType<Doc.GCAggregatedEntry|undefined>(data.gc.get(Doc.GCOp.weakCB))
  expectType<number>(data.activeHandles)
  expectType<number>(data.raw.cpu.system)
  expectType<number>(data.raw.cpu.user)
  expectType<number | Doc.EventLoopDelayHistogram>(data.raw.eventLoopDelay)
})

// These should not
expectError(() => { Doc(1) })
expectError(() => { Doc('string') })
expectError(() => { Doc(null) })
expectError(() => { Doc({ foo: 'bar' }) })
expectError(() => { Doc({ sampleInterval: 'bar' }) })
expectError(() => { Doc({ eventLoopOptions: 'bar' }) })
