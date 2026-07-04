# Data Structures in This Project — Queue & Heap

This document explains two data-structure topics as they appear in the Food
Inventory app, in plain language, with the real code and the files where each
lives.

---

## Part 1 — The Queue (First In, First Out)

### Explaination

Imagine a line at an ice-cream shop. The **first** kid to join the line is the
**first** to get ice cream. New kids join at the **back**. Nobody cuts in line.

That is a **Queue**. Two magic words:

- **enqueue** = join the back of the line
- **dequeue** = the front kid leaves (gets served)

We use this for **deliveries**: the delivery that has been waiting longest
should go out first. So we put all the waiting deliveries in a line (queue) and
serve the one at the front.

### Where the Queue lives 📁

| What | File |
| --- | --- |
| The Queue itself (the data structure) | [`src/shared/dataStructures/Queue.js`](src/shared/dataStructures/Queue.js) |
| A test that proves it works | [`src/shared/dataStructures/Queue.test.js`](src/shared/dataStructures/Queue.test.js) |
| Where we *use* it (send out a delivery) | [`src/features/deliveries/services/deliveryService.js`](src/features/deliveries/services/deliveryService.js) |
| The button that triggers it | [`src/features/deliveries/components/DeliveryModule.js`](src/features/deliveries/components/DeliveryModule.js) |
| The web address it calls | [`src/app/api/deliveries/dispatch/route.js`](src/app/api/deliveries/dispatch/route.js) |

### The Queue code

From [`src/shared/dataStructures/Queue.js`](src/shared/dataStructures/Queue.js):

```js
// Queue — a First-In, First-Out (FIFO) collection.
//   enqueue -> [ A  B  C ] -> dequeue
//   (back)                    (front)
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
```

**In kid words:** the line is just a list (`items`). Joining the back is
`push`. The front kid leaving is `shift`. `peek` is looking at who's first
without pulling them out.

### Where we actually use it

From [`src/features/deliveries/services/deliveryService.js`](src/features/deliveries/services/deliveryService.js#L123) (lines 120–143):

```js
// Dispatch the next pending delivery using a FIFO queue: load all pending jobs
// in line order (earliest scheduled first, then oldest created), then serve the
// one at the front by advancing it 'pending' -> 'assigned'.
export async function dispatchNextDelivery() {
  await ensureBusinessTables()

  const result = await pool.query(
    `SELECT * FROM food_deliveries WHERE status = 'pending'
     ORDER BY scheduled_at ASC NULLS LAST, created_at ASC`
  )

  const queue = new Queue(result.rows.map(serializeDelivery))
  if (queue.isEmpty()) return { error: 'No pending deliveries in the queue', status: 404 }

  const next = queue.dequeue()               // front of the line
  const upNext = queue.peek()                // who is served next time
  const dispatched = await updateDeliveryStatus(next.id, 'assigned')

  return {
    delivery: dispatched.delivery,
    remaining: queue.size,
    upNext: upNext ? upNext.orderNumber : null,
  }
}
```

**Step by step:**
1. Ask the database for every delivery still `pending`, oldest first.
2. Put them all in a **Queue** (they line up).
3. `dequeue()` — pull the delivery at the **front** (the one waiting longest).
4. `peek()` — sneak a look at who is next in line, to tell the user.
5. Mark the pulled delivery as `assigned` (it's on its way!).

### The button that starts it 🖲️

The delivery page has a **"Dispatch next"** button. When you click it:

From [`src/features/deliveries/components/DeliveryModule.js`](src/features/deliveries/components/DeliveryModule.js#L398):

```js
async function dispatchNext() {
  setError("");
  setMessage("");
  const res = await fetch("/api/deliveries/dispatch", { method: "POST" });
  const data = await res.json();
  if (!res.ok) return setError(data.error || "Failed to dispatch delivery");
  setDeliveries((prev) =>
    prev.map((item) => (item.id === data.delivery.id ? data.delivery : item)),
  );
  setMessage(
    `Dispatched ${data.delivery.orderNumber}${data.upNext ? ` · next up ${data.upNext}` : ""} · ${data.remaining} left in queue`,
  );
}
```

The button itself (lines 456–464) counts how many are waiting and switches off
when the line is empty:

```jsx
<button type="button" onClick={dispatchNext} disabled={pendingCount === 0} ...>
  <Icon name="delivery" className="size-4" />
  Dispatch next{pendingCount ? ` (${pendingCount})` : ""}
</button>
```

### The whole journey of one click 🚚

```
[Dispatch next button]  →  POST /api/deliveries/dispatch  →  dispatchNextDelivery()
      (screen)                    (route.js)                     (uses the Queue)
                                                                        │
                                                          front of queue is served
                                                                        │
                                                          delivery becomes "assigned"
```

### Prove it works ✔️

Run the little test — it checks that things come out in the order they went in:

```bash
node src/shared/dataStructures/Queue.test.js
# → Queue self-check passed ✓
```

---

## Part 2 — The Heap (Min & Max, using an array)

### Explaination

A **Heap** is a **magic box**. Every time you drop something in, the box
shuffles so that **the most important thing is always sitting right on top**.
You never have to search — you just grab the top.

- **Min-Heap** = the **smallest** number is on top (great for "which expires *soonest*?").
- **Max-Heap** = the **biggest** number is on top (great for "which is the *largest*?").

### The "using an array" part 🔢

A heap looks like a tree, but we store it in a **plain list (array)** using
simple math — no pointers needed:

```
        [10]            index 0  ← the top (smallest in a Min-Heap)
       /    \
    [15]    [20]        index 1, 2
    /  \
 [40] [50]             index 3, 4

For any item at position i:
  parent      → (i - 1) / 2
  left child  → 2 * i + 1
  right child → 2 * i + 2
```

That index math is the entire trick of "a heap using arrays only."

### How the Heap shows up in *our* app 📁

Here is the honest part. For inventory we needed exactly what a Min-Heap gives
you: **"show me the item that expires soonest, first."** But we did **not**
hand-write a heap — the **database keeps that order for us**. A database is very
good at keeping things sorted, so asking it for "soonest expiry on top" gives us
the *same result a Min-Heap would*, with less code.

From [`src/features/inventory/services/inventoryService.js`](src/features/inventory/services/inventoryService.js#L33) (lines 33–46):

```js
export async function listInventoryItems() {
  await ensureInventoryTable()
  const result = await pool.query(
    `SELECT id, name, category, quantity, unit, min_quantity, expiry_date,
      location, notes, created_by, created_at, updated_at
     FROM food_inventory_items
     ORDER BY
      CASE WHEN expiry_date IS NULL THEN 1 ELSE 0 END,  -- items with no date go last
      expiry_date ASC,                                   -- soonest expiry on TOP  ← Min-Heap behaviour
      created_at DESC`
  )

  return result.rows.map(serializeInventoryItem)
}
```

The line `expiry_date ASC` is the important one: it puts the **soonest-to-expire
item on top** — exactly the "top of the box" you'd pop from a Min-Heap.

### Why we did it this way (and why that's the *smart* answer)

A Heap's job is "keep the most urgent thing on top." The database already does
that job when we say `ORDER BY expiry_date`. Writing our own array heap on top
would be **redoing work the database already does** — more code, more chances
for bugs, zero extra benefit.

So the mature way to say it in a viva/report is:

> *"I used a real **Queue** for delivery dispatch, because nothing was ordering
> the deliveries. I did **not** re-implement a **Heap** for inventory, because
> the database's `ORDER BY expiry_date` already keeps the most urgent item on
> top — which is exactly the Min-Heap behaviour. Choosing the built-in tool over
> re-inventing it is the right engineering call."*

---

## Quick reference

| Topic | Status in the app | Main file(s) |
| --- | --- | --- |
| **Queue (FIFO)** | ✅ Hand-built data structure, used to dispatch deliveries | [`Queue.js`](src/shared/dataStructures/Queue.js), [`deliveryService.js`](src/features/deliveries/services/deliveryService.js#L123) |
| **Heap (Min/Max, array)** | ✅ Behaviour is live (soonest-expiry on top), provided by the database — not a hand-written heap | [`inventoryService.js`](src/features/inventory/services/inventoryService.js#L33) |
