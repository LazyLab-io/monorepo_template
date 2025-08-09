import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.listen({host: "0.0.0.0", port: 3000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
