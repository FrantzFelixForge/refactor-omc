"use strict";

const express = require(`express`);
const morgan = require(`morgan`);
const routes = require(`./routes`);
require("dotenv").config();
const { prompts, initAsanaEnv } = require("./utils/asanaUtil");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan(`dev`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));
app.use(routes);

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});

(async function () {
  const { workspaceGID, userGID, projectGID, teamGID, tagsObj } =
    await initAsanaEnv();
  prompts(workspaceGID, userGID, projectGID, teamGID, tagsObj);
})();
