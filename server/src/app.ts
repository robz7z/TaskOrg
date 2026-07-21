import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify()

app.register(cors, { origin: 'http://localhost:5173' })

app.get('/hello', async (request, reply) => {
  return {
    message: 'Olá, mundo!'
  }
})

app.listen({ port: 3035 }, (err, address) => {
  if (err) throw err
  console.log(`Server listening at ${address}`)
})