import assert from 'node:assert'
import Queue from './Queue.js'

// FIFO order: what goes in first comes out first.
const q = new Queue(['A', 'B'])
q.enqueue('C')
assert.equal(q.size, 3)
assert.equal(q.peek(), 'A')          // peek does not remove
assert.equal(q.size, 3)
assert.equal(q.dequeue(), 'A')       // front leaves first
assert.equal(q.dequeue(), 'B')
assert.equal(q.dequeue(), 'C')
assert.ok(q.isEmpty())
assert.equal(q.dequeue(), undefined) // empty queue is safe

console.log('Queue self-check passed ✓')
