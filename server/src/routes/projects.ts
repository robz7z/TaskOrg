import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../db/index.js'
import { projects } from '../db/schema'
import { eq, and } from 'drizzle-orm'

export async function projectRoutes(app: FastifyInstance) {
  
  // GET /projects – só os do usuário
  app.get('/projects', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user?.id
      if (!userId) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }

      const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, userId))

      return reply.status(200).send(userProjects)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar projetos' })
    }
  })

  app.get('/projects/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = request.user?.id
      if (!userId) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }

      const result = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, Number(id)),
            eq(projects.userId, userId)
          )
        )

      if (!result.length) {
        return reply.status(404).send({ error: 'Projeto não encontrado' })
      }
      return reply.status(200).send(result[0])
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar projeto' })
    }
  })

  // POST /projects – cria com userId do token
  app.post('/projects', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name } = request.body as { name: string }
      const userId = request.user?.id
      if (!userId) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }
      if (!name) {
        return reply.status(400).send({ error: 'Nome é obrigatório' })
      }

      const [newProject] = await db
        .insert(projects)
        .values({ name, userId })
        .returning()

      return reply.status(201).send(newProject)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao criar projeto' })
    }
  })

  // PUT /projects/:id – só se for do usuário
  app.put('/projects/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const { name } = request.body as { name: string }
      const userId = request.user?.id
      if (!userId) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }
      if (!name) {
        return reply.status(400).send({ error: 'Nome é obrigatório' })
      }

      const existing = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, Number(id)),
            eq(projects.userId, userId)
          )
        )

      if (!existing.length) {
        return reply.status(404).send({ error: 'Projeto não encontrado ou não pertence a você' })
      }

      const [updated] = await db
        .update(projects)
        .set({ name })
        .where(eq(projects.id, Number(id)))
        .returning()

      return reply.status(200).send(updated)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao atualizar projeto' })
    }
  })

  // DELETE /projects/:id – só se for do usuário
  app.delete('/projects/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = request.user?.id
      if (!userId) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }

      const existing = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, Number(id)),
            eq(projects.userId, userId)
          )
        )

      if (!existing.length) {
        return reply.status(404).send({ error: 'Projeto não encontrado ou não pertence a você' })
      }

      await db
        .delete(projects)
        .where(eq(projects.id, Number(id)))

      return reply.status(200).send({ message: 'Projeto deletado com sucesso' })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao deletar projeto' })
    }
  })
}