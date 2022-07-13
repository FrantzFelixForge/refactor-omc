"use strict";

const express = require(`express`);
const morgan = require(`morgan`);
const path = require(`path`);
const routes = require(`./routes`);
require("dotenv").config();
const inquirer = require("inquirer");
const fetch = require(`node-fetch`);
const asana = require("asana");
const { getAllDeals, prompts, initAsanaEnv } = require("./utils/asanaUtil");
const { UserPrompts } = require("./utils/inquirer");
const {
  Webhook,
  Task,
  Tag,
  Workspace,
  Project,
  User,
  Team,
  Section,
} = require("./controllers");
const { exit } = require("process");
const { prompt } = require("inquirer");

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
// initAsanaEnv();
// Brokers, Ops Person, Share Count, Share Price, Total Consideration, Commission Total, and Wire Amount (but wire amount is not a field that exists right now)
