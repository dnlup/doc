import { strictEqual } from 'assert'
import { doc, Sampler, errors } from '../../index.js'

strictEqual(typeof doc, 'function')
strictEqual(typeof Sampler, 'function')
strictEqual(typeof errors, 'object')
