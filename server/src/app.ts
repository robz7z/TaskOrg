import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from './routes/auth.js'
import { authMiddleware } from './middleware/auth.js'
import { projectRoutes } from './routes/projects.js'
import { taskRoutes } from './routes/tasks.js'

const app = Fastify()

app.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

authMiddleware(app)

app.register(authRoutes, { prefix: '/api' })
app.register(projectRoutes, { prefix: '/api' })
app.register(taskRoutes, { prefix: '/api' })

app.listen({ 
  port: Number(process.env.PORT) || 3035,
  host: '0.0.0.0' },
  (err, address) => {
  if (err) throw err
  console.log(`Server listening at ${address}`)
})