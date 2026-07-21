import type { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db'
import { users } from '../db/schema'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

export async function authRoutes(app: FastifyInstance): Promise<void> {

  app.post('auth/register', async (request, reply) => {
    const { email, password, name } = request.body as {
      email: string;
      password: string;
      name: string 
    }

    if (!email || !password) {
      return reply.status(400).send({ error: 'Email e senha são obrigatórios' })
    }
    
    //verifica se o email existe
    const existingUser = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    
    if (existingUser.length > 0) {
      return reply.status(409).send({ message: 'Usuário já existe' })
    }
    
    //hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)
    
    //cria o usuário
    const [ newUser ] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      name: name || null
    })
    .returning({ id: users.id, email: users.email, name: users.name })

    if (!newUser) {
    return reply.status(500).send({ error: 'Falha ao criar usuário' })
    }
    
    //gera o token JWT
    const token = jwt.sign({  
      id: newUser.id,
      email: newUser.email },
      JWT_SECRET, { expiresIn: '1h' })

    return { token, user: newUser }  
  })

  // Login
  app.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string
      password: string
    }
    
    if (!email || !password) {
      return reply.status(400).send({ error: 'Email e senha são obrigatórios' })
    }

    // Busca o usuário
    const result = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

    if (result.length === 0) {
      return reply.status(401).send({ error: 'Credenciais inválidas' })
    }

    const user = result[0]!

    // Verifica a senha
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return reply.status(401).send({ error: 'Credenciais inválidas' })
    }

    // Gera o token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    return { token, user: { id: user.id, email: user.email, name: user.name } }
  })

  //perfil do usuário autenticado
  app.get('/auth/profile', async (request, reply) => {
    return {
      user: request.user,
      message: 'Você está autenticado!'
    }
  })
}