import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth';
import { authMiddleware } from './middleware/auth';
import { projectRoutes } from './routes/projects';

const app = Fastify()

app.register(cors, { origin: 'http://localhost:5173' })

authMiddleware(app)

app.register(authRoutes, { prefix: '/api' })
app.register(projectRoutes, { prefix: '/api' })


app.listen({ 
  port: Number(process.env.PORT) || 3035,
  host: '0.0.0.0' },
  (err, address) => {
  if (err) throw err
  console.log(`Server listening at ${address}`)
})