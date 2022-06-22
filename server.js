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
const asana = require(`asana`);

app.use(morgan(`dev`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));
app.use(routes);

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});
// function makeChoices(dataArray){
//     const choiceObj = {};
//     const choiceArray = [];
//     data.map(function (dataArray) {
//       choiceObj[dataArray.name] = dataArray.gid;
//       choiceArray.push(dataArray.name);
//     });
//     return choiceArray;

// }

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
async function findUser() {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  const currentUser = await client.users.me().then(function (me) {
    return me;
  });
  // console.dir(currentUser, { depth: null });
  return currentUser.gid;
}
async function findTeam(workspaceGID, userGID) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  try {
    const { data } = await client.teams.getTeamsForUser(`${userGID}`, {
      workspace: `${workspaceGID}`,
      opt_fields: "gid",
      opt_fields: "name",
    });
    const choiceObj = {};
    const choiceArray = [];
    data.map(function (team) {
      choiceObj[team.name] = team.gid;
      choiceArray.push(team.name);
    });
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "team",
        message: "What team is the project in?",
        choices: choiceArray,
      },
    ]);
    return choiceObj[answers.team];
  } catch (error) {
    console.log(error);
    return error;
  }

  // client.teams.dispatchGet();
}
async function findProject(teamGID) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  try {
    const { data } = await client.projects.getProjectsForTeam(teamGID, {
      opt_fields: "gid",
      opt_fields: "name",
    });
    const choiceObj = {};
    const choiceArray = [];
    data.map(function (project) {
      choiceObj[project.name] = project.gid;
      choiceArray.push(project.name);
    });
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "project",
        message: "What project did you want to select?",
        choices: choiceArray,
      },
    ]);
    return choiceObj[answers.project];
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function addDeal(workspaceGID, projectGID, userGID, dealInfo) {
  const newDeal = {
    data: {
      approval_status: "pending",
      assignee: `${userGID}`,
      assignee_status: "upcoming",
      completed: false,
      // due_on: `${req.body.taskCompletionDate}`,
      //liked: true,
      name: `${dealInfo.issuer} | ${dealInfo.seller}/${dealInfo.buyer} | $${dealInfo.price}`,
      notes: `Term Sheet notes here`,
      projects: [`${projectGID}`],
      resource_subtype: "default_task",
      //start_on: todaysDate,
      parent: null,
      workspace: `${workspaceGID}`,
      //custom_fields: req.body.custom_fields,
    },
  };
  try {
    const response = await fetch(`https://app.asana.com/api/1.0/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(newDeal),
    });
    const data = await response.json();

    console.log(data);
    //res.status(201).json(data);
    return data;
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
}
async function getDeal() {}
async function mainMenu() {
  let answers = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "What do you want to do next?",
      choices: ["Get all deals?", "Add a deal?"],
    },
  ]);
  return answers.menu;
}
async function promptUser() {
  let runAgain = true;
  while (runAgain) {
    try {
      const workspaceGID = await findWorkspace();
      const userGID = await findUser();
      const teamGID = await findTeam(workspaceGID, userGID);
      const projectGID = await findProject(teamGID);
      const nextInteraction = await mainMenu();
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

      switch (nextInteraction) {
        case "Add a deal?":
          console.log("Adding a deal...");
          addDeal(workspaceGID, projectGID, userGID, dealInfo);
          break;
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
    } catch (error) {
      console.log(error);
    }
  }
}

promptUser();
