import { Hono } from 'hono'
import { renderer } from './renderer'

// Define the D1 binding matching your wrangler.toml
type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()


app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

export default app
