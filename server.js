"use strict";

const express = require(`express`);
const morgan = require(`morgan`);
const path = require(`path`);
const routes = require(`./routes`);
require("dotenv").config();
const inquirer = require("inquirer");
const fetch = require(`node-fetch`);
const {
  findWorkspace,
  findUser,
  findTeam,
  findProject,
  addDeal,
  getDeal,
  getSectionList,
  getDealsInSection,
  generateTags,
} = require("./utils/asanaUtil");
const { Webhook, Task } = require("./controllers");
const { exit } = require("process");
const asana = require("asana");

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

async function mainMenu() {
  let answers = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "What do you want to do next?",
      choices: [
        "Get all deals.",
        "Add a deal.",
        "Get all deals in a section.",
        "Listen for changes in Asana.",
      ],
    },
  ]);
  return answers.menu;
}
async function promptUser() {
  let runAgain = true;

  try {
    // const workspaceGID = await findWorkspace();
    // const userGID = await findUser();
    // const teamGID = await findTeam(workspaceGID, userGID);
    // const projectGID = await findProject(teamGID);
    // const tagsObj = await generateTags(workspaceGID);
    const tagsObj = await generateTags(process.env.WORKSPACE_GID);
    while (runAgain) {
      const nextInteraction = await mainMenu();

      switch (nextInteraction) {
        case "Add a deal.":
          console.log("Adding a deal...");
          // const results = await addDeal(
          //   workspaceGID,
          //   projectGID,
          //   userGID,
          //   tagsObj,
          //   dealInfo
          // );
          const asanaTask = new Task();
          await asanaTask.createTask(tagsObj);
          console.log("Deal added --->");
          break;
        case "Get all deals.":
          console.log("Getting all deals...");
          await getDeal(process.env.PROJECT_GID);
          break;
        case "Get all deals in a section.":
          const { sectionGID, sectionName } = await getSectionList(
            process.env.PROJECT_GID
          );
          console.log(`Getting all tasks in ${sectionName}...`);
          console.table(await getDealsInSection(sectionGID));
          break;
        case "Listen for changes in Asana.":
          const asanaWebhook = new Webhook();
          asanaWebhook.createWebhook(process.env.PROJECT_GID);
          break;
        default:
          console.log("Unknown interaction: " + nextInteraction);
      }
      let answers = await inquirer.prompt([
        {
          type: "list",
          name: "continue",
          message: "Do you want to continue?",
          choices: ["yes", "no"],
        },
      ]);
      answers.continue === "yes" ? (runAgain = true) : (runAgain = false);
      if (!runAgain) {
        const asanaWebhook = new Webhook();
        const { data } = await asanaWebhook.getWebhooks();
        for (let i = 0; i < data.length; i++) {
          const { gid } = data[i];
          const deletedWebhookMsg = await asanaWebhook.deleteWebhook(gid);
          console.log(deletedWebhookMsg);
        }
        exit();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

promptUser();

// Brokers, Ops Person, Share Count, Share Price, Total Consideration, Commission Total, and Wire Amount (but wire amount is not a field that exists right now)
