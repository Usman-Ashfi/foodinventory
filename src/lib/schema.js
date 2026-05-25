import pool from '@/lib/db'

const globalForSchema = globalThis

export async function ensureInventoryTable() {
  globalForSchema.__inventorySchemaReady ??= pool.query(`
    CREATE TABLE IF NOT EXISTS food_inventory_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      category VARCHAR(80) DEFAULT 'Other',
      quantity NUMERIC(10, 2) DEFAULT 0,
      unit VARCHAR(30) DEFAULT 'pcs',
      min_quantity NUMERIC(10, 2) DEFAULT 0,
      expiry_date DATE,
      location VARCHAR(80) DEFAULT 'Pantry',
      notes TEXT,
      created_by INTEGER REFERENCES food_users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await globalForSchema.__inventorySchemaReady
}

export async function ensureBusinessTables() {
  globalForSchema.__businessSchemaReady ??= (async () => {
    await ensureInventoryTable()

    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(40),
        email VARCHAR(120),
        address TEXT,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_by INTEGER REFERENCES food_users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(40) UNIQUE NOT NULL,
        customer_id INTEGER REFERENCES food_customers(id) ON DELETE SET NULL,
        customer_name VARCHAR(120),
        customer_phone VARCHAR(40),
        order_status VARCHAR(30) DEFAULT 'pending',
        payment_status VARCHAR(30) DEFAULT 'unpaid',
        subtotal NUMERIC(12, 2) DEFAULT 0,
        delivery_fee NUMERIC(12, 2) DEFAULT 0,
        discount NUMERIC(12, 2) DEFAULT 0,
        total NUMERIC(12, 2) DEFAULT 0,
        notes TEXT,
        inventory_deducted_at TIMESTAMP,
        created_by INTEGER REFERENCES food_users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES food_orders(id) ON DELETE CASCADE,
        inventory_item_id INTEGER REFERENCES food_inventory_items(id) ON DELETE SET NULL,
        item_name VARCHAR(120) NOT NULL,
        quantity NUMERIC(10, 2) NOT NULL,
        unit_price NUMERIC(12, 2) DEFAULT 0,
        line_total NUMERIC(12, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_deliveries (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES food_orders(id) ON DELETE SET NULL,
        order_number VARCHAR(40),
        customer_name VARCHAR(120),
        customer_phone VARCHAR(40),
        address TEXT,
        driver_name VARCHAR(120),
        driver_phone VARCHAR(40),
        status VARCHAR(30) DEFAULT 'pending',
        scheduled_at TIMESTAMP,
        delivered_at TIMESTAMP,
        notes TEXT,
        created_by INTEGER REFERENCES food_users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  })()

  await globalForSchema.__businessSchemaReady
}
