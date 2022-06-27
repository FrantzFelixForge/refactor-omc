"use strict";

const express = require(`express`);
const morgan = require(`morgan`);
const path = require(`path`);
const routes = require(`./routes`);
require("dotenv").config();
const inquirer = require("inquirer");
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
const { exit } = require("process");

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
      choices: ["Get all deals.", "Add a deal.", "Get all deals in a section."],
    },
  ]);
  return answers.menu;
}
async function promptUser() {
  let runAgain = true;

  try {
    const dealInfo = {
      // workspaceGID: 1111138376302363,
      // teamGID: 1202402175058585,
      // projectGID: 1202402175058587,
      // assigneeGID: 1202402171924303,
      id: "DT22-6826-A",
      issuer: "SpaceX",
      broker: "Gordon-Rogoff",
      operations: "Hutler",
      buyer: "Kenny",
      seller: "Confidential91",
      quantity: 14286,
      price: 70.0,
      type: "Fund Direct",
      total: 1000020.0,
      commission: 50000.0,
      date: "06-06-2022",
      buyerStatus: "NO ACTION",
      sellerStatus: "NO ACTION",
      // custom_fields: {
      //   1202448347979193: "Kenny",
      //   1202448385422158: "1202448385422161",
      //   1202453114761807: 70.0,
      //   1202448400714028: "Confidential91",
      //   1202448362499526: "SpaceX",
      //   1202448476119897: "DT22-6826-A",
      //   1202448402746765: 50000.0,
      //   1202448403702940: 14286,
      //   1202448367301577: 1000020.0,
      // },
    };
    dealInfo["wireAmount"] = dealInfo.total + dealInfo.commission;
    //TODO: try promise.all to run some of the concurrently.
    const workspaceGID = await findWorkspace();
    const userGID = await findUser();
    const teamGID = await findTeam(workspaceGID, userGID);
    const projectGID = await findProject(teamGID);
    const tagsObj = await generateTags(workspaceGID);
    while (runAgain) {
      const nextInteraction = await mainMenu();

      switch (nextInteraction) {
        case "Add a deal.":
          console.log("Adding a deal...");
          const results = await addDeal(
            workspaceGID,
            projectGID,
            userGID,
            tagsObj,
            dealInfo
          );
          //console.log("Deal added --->", results);
          break;
        case "Get all deals.":
          console.log("Getting all deals...");
          await getDeal(projectGID);
          break;
        case "Get all deals in a section.":
          const { sectionGID, sectionName } = await getSectionList(projectGID);
          console.log(`Getting all tasks in ${sectionName}...`);
          console.table(await getDealsInSection(sectionGID));
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
        exit();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

promptUser();

// Brokers, Ops Person, Share Count, Share Price, Total Consideration, Commission Total, and Wire Amount (but wire amount is not a field that exists right now)
