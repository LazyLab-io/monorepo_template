import Fastify from "fastify";
import { envs } from "@repo/env-loader";

const fastify = Fastify({ logger: true });

fastify.get("/", function (request, reply) {
  reply.send({ hello: "template" });
});

console.log(envs.PORT);
console.log(envs.NODE_ENV);
console.log(envs.DB_URL);

fastify.listen({ host: "0.0.0.0", port: 3010 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
