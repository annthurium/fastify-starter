const fastify = require("fastify")({ logger: true });
const path = require("node:path");
const ld = require("@launchdarkly/node-server-sdk");
require("dotenv").config();

const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;

const client = ld.init(sdkKey);

fastify.addHook("preParsing", async (request) => {
  const context = {
    kind: "user",
    key: "user-key-123abcde",
    email: "foo@bar.edu",
  };

  const flagKey = "show-student-version";

  const showStudentVersion = await client.variation(flagKey, context, false);
  console.log("showStudentVersion", showStudentVersion);
  request.showStudentVersion = showStudentVersion;
});

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
