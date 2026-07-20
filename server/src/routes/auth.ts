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
    
    //verifica se o email existe
    const existingUser = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    
    if (existingUser.length > 0) {
      return reply.status(409).send({ message: 'User already exists' })
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
}