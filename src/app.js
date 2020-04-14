const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateUpdate(request, response, next) {
  if (request.method.toUpperCase() == "PUT" && (request.body.likes) ) {
      return response.status(400).json({ likes: 0 })
  }
  return next();
}

app.use(validateUpdate);

const repositories = [];

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const id = uuid();
  const likes = 0;
  const repository = { id, url, title, likes, techs };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.put("/repositories/:id", (request, response) => {
  const { url, title, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository not found." });
  }

  repositories[repositoryIndex] = { id, url, title, techs };

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository not found." });
  }

  const repository = repositories[repositoryIndex];

  repository.likes = (repository.likes) ? repository.likes + 1 : 1;

  repositories[repositoryIndex] = repository;

  const { likes } = repositories[repositoryIndex];

  return response.status(200).json({ likes });
});

module.exports = app;
