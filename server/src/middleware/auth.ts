import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

//tipagem do request para incluir o usuário autenticado
declare module 'fastify' {
interface FastifyRequest {
    user?: {
      id: number;
      email: string;
    };
  }
}

export async function authMiddleware(app: FastifyInstance): Promise<void> {
  //hook executando antes de cada requsisição
  app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    //igora as rotas de autenticação (login/register)
    if (request.url.startsWith('/api/auth')) return

    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Token não provideciado' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return reply.status(401).send({
        message: 'Token não fornecido'
      })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: number; email: string }
      request.user = decoded
    } catch (error) {
      // 4. Diferencia erro de assinatura de expiração (opcional, mas profissional)
      if (error instanceof jwt.TokenExpiredError) {
        return reply.status(401).send({ message: 'Token expirado' })
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return reply.status(401).send({ message: 'Token inválido' })
      }
      return reply.status(401).send({ message: 'Erro na autenticação' })
    }
  })
}