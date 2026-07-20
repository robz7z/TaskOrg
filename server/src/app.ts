import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify()

app.register(cors, { origin: 'http://localhost:5173' })

app.listen({ port: Number(process.env.PORT) || 3035, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err
  console.log(`Server listening at ${address}`)
})