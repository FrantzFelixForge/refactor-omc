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
  choices,
} = require("./utils/asanaUtil");
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
    console.log(
      "Fetching information about workspace, team, project, tags and current user..."
    );
    const asanaWorkspace = new Workspace();
    const workspace = await asanaWorkspace.getForgeWorkspace();
    const workspaceGID = workspace.gid || process.env.WORKSPACE_GID;

    const asanaUser = new User();
    const user = await asanaUser.getMe();
    const userGID = user.gid || process.env.ME_GID;

    const asanaProject = new Project();
    const project = await asanaProject.getSandboxProject();
    const projectGID = project.gid || process.env.PROJECT_GID;

    const asanaTeam = new Team();
    const team = await asanaTeam.getEngTeam();
    const teamGID = team.gid || process.env.ENG_TEAM_GID;

    const asanaTag = new Tag();
    const tagsObj = await asanaTag.generateTags(process.env.WORKSPACE_GID);
    while (runAgain) {
      const nextInteraction = await mainMenu();

      switch (nextInteraction) {
        case "Add a deal.":
          console.log("Adding a deal...");
          const asanaTask = new Task();
          await asanaTask.createTask(tagsObj);
          console.log("Deal added --->");
          break;
        case "Get all deals.":
          console.log("Getting all deals...");
          const gettingAsanaTasks = new Task();
          const result = await gettingAsanaTasks.getTaskByProject(projectGID);
          console.table(result, ["name", "completed", "assignee"]);

          break;
        case "Get all deals in a section.":
          const asanaSection = new Section();
          const sections = await asanaSection.getSectionsByProject(projectGID);
          const { choiceArray, choiceObj } = choices(sections);
          let answers = await inquirer.prompt([
            {
              type: "list",
              name: "section",
              message: "What section did you want to select?",
              choices: choiceArray,
            },
          ]);
          const sectionName = answers.section;
          const sectionGID = choiceObj[answers.section];
          console.log(`Getting all tasks in ${sectionName}...`);
          console.table(await asanaSection.getTasksInSection(sectionGID), [
            "name",
            "completed",
            "assignee",
          ]);
          break;
        case "Listen for changes in Asana.":
          const asanaWebhook = new Webhook();
          asanaWebhook.createWebhook(projectGID);
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
