import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password, name } = request.body as {
        email: string
        password: string
        name?: string
      }

      if (!email || !password) {
        return reply.status(400).send({ error: 'Email e senha são obrigatórios' })
      }

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser) {
        return reply.status(409).send({ error: 'Usuário já existe' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const [newUser] = await db
        .insert(users)
        .values({ email, password: hashedPassword, name: name ?? null })
        .returning({ id: users.id, email: users.email, name: users.name })

      if (!newUser) {
        return reply.status(500).send({ error: 'Falha ao criar usuário' })
      }

      const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' })

      return reply.status(201).send({ token, user: newUser })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as {
        email: string
        password: string
      }

      if (!email || !password) {
        return reply.status(400).send({ error: 'Email e senha são obrigatórios' })
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (!user) {
        return reply.status(401).send({ error: 'Credenciais inválidas' })
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        return reply.status(401).send({ error: 'Credenciais inválidas' })
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

      return reply.status(200).send({ token, user: { id: user.id, email: user.email, name: user.name } })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.get('/auth/profile', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as { id: number; email: string } | undefined
      if (!user) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }

      return reply.status(200).send({
        user,
        message: 'Você está autenticado!',
      })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}