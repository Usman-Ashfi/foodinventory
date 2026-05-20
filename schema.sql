-- Food Inventory Login Schema
-- Creates a dedicated table for this app to avoid conflicts with existing tables

CREATE TABLE IF NOT EXISTS food_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

-- Default login: admin / admin123
INSERT INTO food_users (username, password_hash, full_name, role)
VALUES (
  'admin',
  '$2a$10$nAklL6dFSOzbU78.43O34OG7n6U9UNm9jGTjXo0U8tgeIvq.totaS',
  'Administrator',
  'admin'
)
ON CONFLICT (username) DO NOTHING;
