import express from "express";
import { nanoid } from "nanoid";

const db = [
  {
    id: "DBCC2857",
    content: `ReferenceError: qwüdpkqwdkpokqwpdk is not defined
    at file:///C:/Users/basic/projects/BEAM/mongodb-project/server/index.js:9:1
    at ModuleJob.run (node:internal/modules/esm/module_job:197:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:337:24)
    at async loadESM (node:internal/process/esm_loader:88:5)
    at async handleMainPromise (node:internal/modules/run_main:61:12)
[nodemon] app crashed - waiting for file changes before starting...`,
  },
  {
    id: "6F79257C",
    content: `console.log(3791827398d7qwe98d7wq9d)
    ^^^^^^^^^^

SyntaxError: Invalid or unexpected token
at ESMLoader.moduleStrategy (node:internal/modules/esm/translators:115:18)
at ESMLoader.moduleProvider (node:internal/modules/esm/loader:289:14)
at async link (node:internal/modules/esm/module_job:70:21)
[nodemon] app crashed - waiting for file changes before starting...
`,
  },
];

const app = express();
app.use(express.json());

app.get("/", function (request, response) {
  console.log("request received at /");
  response.send("hello!");
});

app.get("/snippets", function (request, response) {
  response.send(db);
});

app.get("/snippets/:id", function (request, response) {
  const { id } = request.params;
  const foundDocument = db.find((item) => item.id === id);
  if (foundDocument) {
    response.send(foundDocument);
  } else {
    response.status(404).send("snippet not found");
  }
});

app.post("/snippets", function (request, response) {
  // request.body = json content of a POST request
  console.log(request.body);
  // 1) get content
  // 2) save it in the db
  const newDocument = {
    id: nanoid(8),
    content: request.body.content,
  };
  db.push(newDocument);

  response.send(newDocument);
});

app.delete("/snippets/:id", function (request, response) {
  const { id } = request.params;
  const foundDocument = db.find((item) => item.id === id);
  if (foundDocument) {
    db.splice(db.indexOf(foundDocument), 1);
    response.send("snippet deleted succesfully");
  } else {
    response.status(404).send("snippet not found");
  }
});

// find the existing document based on id
// update it with the new content
// send back to the client the updated document

app.put("/snippets/:id", function (request, response) {
  const { id } = request.params;
  const foundDocument = db.find((item) => item.id === id);
  if (foundDocument) {
    const indexOfDoc = db.indexOf(foundDocument);
    db[indexOfDoc].content = request.body.content;
    response.send(db[indexOfDoc]);
  } else {
    response.status(404).send("snippet not found");
  }
});

app.listen(9000, function () {
  console.log("listening on http://localhost:9000");
});

// GET  http://localhost:9000/snippets
// GET  http://localhost:9000/snippets/012938102
// POST http://localhost:9000/snippets
// PUT, DELETE http://localhost:9000/snippets/81023981

// HTTP VERBS
// GET -> i want some data
// POST -> i want to create something
// UPDATE (or PUT) -> i want to update something with this ID
// DELETE -> i want to do delete something with this ID
