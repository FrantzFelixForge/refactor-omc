"use strict";

const express = require(`express`);
const morgan = require(`morgan`);
const path = require(`path`);
const routes = require(`./routes`);
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const inquirer = require("inquirer");
const fetch = require(`node-fetch`);

app.use(morgan(`dev`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));
app.use(routes);

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});

async function findWorkspace() {
  try {
    const response = await fetch(
      `https://app.asana.com/api/1.0/workspaces?opt_fields=name,gid`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
        },
      }
    );
    const { data } = await response.json();
    const choiceObj = {};
    const choiceArray = [];
    data.map(function (workspace) {
      choiceObj[workspace.name] = workspace.gid;
      choiceArray.push(workspace.name);
    });
    console.log(choiceObj);
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "workspace",
        message: "What workspace are you apart of?",
        choices: choiceArray,
      },
    ]);
    return choiceObj[answers.workspace];
  } catch (error) {
    console.log(error);
  }
}

async function promptUser() {
  let runAgain = true;
  while (runAgain) {
    try {
      const workspaceGID = await findWorkspace();
      console.log(workspaceGID);

      let answers = await inquirer.prompt([
        {
          type: "list",
          name: "continue",
          message: "Do you want to continue?",
          choices: ["yes", "no"],
        },
      ]);
      answers.continue === "yes" ? (runAgain = true) : (runAgain = false);
    } catch (error) {
      console.log(error);
    }
  }
}

promptUser();
