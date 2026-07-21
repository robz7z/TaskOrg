import Fastify from "fastify";

const app = Fastify();

app.get("/hello", async (request, reply) => {
  return {
    message: "Hello World"
  };
});

app.listen({
  port: 3035
}).then(() => {
  console.log("Servidor rodando na porta 3035");
});