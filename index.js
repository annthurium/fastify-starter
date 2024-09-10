const fastify = require("fastify")({ logger: true });
const path = require("node:path");

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "static"),
  prefix: "/static/", // optional: default '/'
});

fastify.get("/", function (req, reply) {
  let fileName = "index.html";
  if (req.showStudentVersion) {
    fileName = "student-index.html";
  }
  reply.sendFile(fileName);
});

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
