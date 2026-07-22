import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number
      email: string
    }
  }
}

export async function authMiddleware(app: FastifyInstance) {
  app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (request.url === '/api/auth/register' || request.url === '/api/auth/login') return

      const authHeader = request.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Token não fornecido' })
      }

      const token = authHeader.split(' ')[1]
      if (!token) {
        return reply.status(401).send({ message: 'Token não fornecido' })
      }

      const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: number; email: string; iat: number; exp: number }
      
      const { iat, exp, ...user } = decoded
      request.user = user

    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return reply.status(401).send({ message: 'Token expirado' })
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return reply.status(401).send({ message: 'Token inválido' })
      }
      return reply.status(500).send({ message: 'Erro interno na autenticação' })
    }
  })
}