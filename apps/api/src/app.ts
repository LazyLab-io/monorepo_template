import Fastify from "fastify";
import { env } from "./env.js";

const fastify = Fastify({ logger: true });

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.listen({ host: "0.0.0.0", port: env.PORT }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
