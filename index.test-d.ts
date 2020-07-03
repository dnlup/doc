import { expectType, expectError } from 'tsd'
import Doc = require('.');

let doc: Doc.DocInstance

// These should work
doc = Doc()
doc = Doc({})
doc = Doc({ sampleInterval: 1234 })
doc = Doc({ eventLoopOptions: { resolution: 5678 } })
doc.on('data', data => {
  expectType<number>(data.cpu)
  expectType<number>(data.eventLoopDelay)
  expectType<number>(data.memory.external)
  expectType<number>(data.memory.heapTotal)
  expectType<number>(data.memory.heapUsed)
  expectType<number>(data.memory.rss)
  expectType<number | undefined>(data.gc.major)
  expectType<number | undefined>(data.gc.minor)
  expectType<number | undefined>(data.gc.incremental)
  expectType<number | undefined>(data.gc.weakCB)
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
