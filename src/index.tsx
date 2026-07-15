
import { Hono } from 'hono'

// Define the D1 binding matching your wrangler.toml
type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 0. GET : sample 
app.get('/', async (c) => {
  return c.json({ message: 'Welcome to the Expense Tracker API!' })
})

// 1. POST: Add a new expense
app.post('/expenses', async (c) => {
  // Parse the JSON payload
  const { description, amount, date } = await c.req.json()

  // Basic safety check to ensure data exists
  if (!description || amount === undefined || !date) {
    return c.json({ error: 'Missing required fields: description, amount, or date' }, 400)
  }

  // Insert the data securely using parameterized inputs (?)
  const { success } = await c.env.DB.prepare(
    'INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)'
  )
    .bind(description, amount, date)
    .run()

  if (success) {
    return c.json({ message: 'Expense logged successfully' }, 201)
  }

  return c.json({ error: 'Failed to insert expense' }, 500)
})

// 2. GET: List all expenses
app.get('/expenses', async (c) => {
  // Fetch all records, sorted by newest first
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM expenses ORDER BY date DESC'
  ).all()

  return c.json(results)
})

// 3. GET: Expense detail
app.get('/expenses/:id', async (c) => {
  const id = c.req.param('id')

  // Execute the query and get the first matching row
  const expense = await c.env.DB.prepare(
    'SELECT * FROM expenses WHERE id = ?'
  )
    .bind(id)
    .first()

  // .first() returns the object if found, or null if it doesn't exist
  if (expense) {
    return c.json(expense)
  }

  // Handle the null case
  return c.json({ error: 'Expense not found' }, 404)
})


// 3. PUT: Update an existing expense
app.put('/expenses/:id', async (c) => {
  const id = c.req.param('id')

  // Destructure the payload, allowing values to be undefined
  const { description, amount, date } = await c.req.json()

  // Execute the update
  const { success, meta } = await c.env.DB.prepare(
    `UPDATE expenses 
     SET description = COALESCE(?, description), 
         amount = COALESCE(?, amount), 
         date = COALESCE(?, date) 
     WHERE id = ?`
  )
    .bind(description ?? null, amount ?? null, date ?? null, id)
    .run()

  // meta.changes tells us how many rows were actually modified
  if (success && meta.changes > 0) {
    return c.json({ message: 'Expense updated successfully' })
  }

  // If no rows changed, the ID probably doesn't exist
  return c.json({ error: 'Expense not found or update failed' }, 404)
})

// 4. DELETE: Remove an expense
app.delete('/expenses/:id', async (c) => {
  const id = c.req.param('id')

  const { success, meta } = await c.env.DB.prepare(
    'DELETE FROM expenses WHERE id = ?'
  )
    .bind(id)
    .run()

  if (success && meta.changes > 0) {
    return c.json({ message: 'Expense deleted successfully' })
  }

  return c.json({ error: 'Expense not found' }, 404)
})

export default app