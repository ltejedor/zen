/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");

const http = require('http');


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });


// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

var img2gcode = require("img2gcode");
var ProgressBar = require("progress"); // npm install progress
var bar = new ProgressBar("Analyze: [:bar] :percent :etas", { total: 100 });

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };

  // The Handlebars code will be able to access the parameter values and build them into the page
  return reply.view("/src/pages/index.hbs", params);
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
  // Build the params object to pass to the template
  let params = { seo: seo };

  return reply.view("/src/pages/index.hbs", params);
});

fastify.get("/saveimage", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };

  // The Handlebars code will be able to access the parameter values and build them into the page
  return reply.view("/src/pages/index.hbs", params);
});

fastify.post('/imgtogcode', function (request, reply) {
  let params = { seo: seo };

  filename = request.body["filepath"]
  console.log(filename);

  img2gcode
    .start({
      // It is mm
      toolDiameter: 10,
      scaleAxes: 500,
      deepStep: -1,
      feedrate: { work: 1200, idle: 3000 },
      whiteZ: 0,
      blackZ: -1,
      safeZ: 1,
      info: "emitter", // "none" or "console" or "emitter"
      // dirImg: __dirname + "/public/hello.png",
      dirImg: filename,
    })
    .on("log", (str) => {
      console.log(str);
    })
    .on("tick", (perc) => {
      bar.update(perc);
    })
    .then((data) => {
      console.log("Saved at "+data.dirgcode);
    });

    params = {
      seo: seo,
    };

    // return reply.send({ filepath: 'world'});
    // return reply.view("/src/pages/index.hbs", {params});
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);

  }
);
