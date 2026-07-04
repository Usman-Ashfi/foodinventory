// Queue — a First-In, First-Out (FIFO) collection.
//
// Think of people lining up: the first to join is the first to be served.
// We use it to dispatch deliveries in the order they should go out — the job
// that has been waiting longest leaves first.
//
//   enqueue -> [ A  B  C ] -> dequeue
//   (back)                    (front)
//
// Run the self-check with:  node src/shared/dataStructures/Queue.test.js
export default class Queue {
  constructor(items = []) {
    this.items = [...items] // index 0 is the front of the queue
  }

  // Add an item to the back of the queue.
  enqueue(item) {
    this.items.push(item)
    return this
  }

  // Remove and return the item at the front (undefined if the queue is empty).
  dequeue() {
    // ponytail: shift() is O(n); fine for dispatch-sized batches. If queues ever
    // grow huge, track a head index instead of shifting.
    return this.items.shift()
  }

  // Look at the front item without removing it.
  peek() {
    return this.items[0]
  }

  isEmpty() {
    return this.items.length === 0
  }

  get size() {
    return this.items.length
  }
}
