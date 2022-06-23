const fetch = require(`node-fetch`);
const asana = require(`asana`);
const inquirer = require("inquirer");

const client = asana.Client.create().useAccessToken(
  process.env.PERSONAL_ACCESS_TOKEN
);
function choices(data) {
  const choiceObj = {};
  const choiceArray = [];
  data.map(function (item) {
    choiceObj[item.name] = item.gid;
    choiceArray.push(item.name);
  });
  return { choiceArray, choiceObj };
}
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
    const { choiceArray, choiceObj } = choices(data);
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
  const currentUser = await client.users.me().then(function (me) {
    return me;
  });
  // console.dir(currentUser, { depth: null });
  return currentUser.gid;
}
async function findTeam(workspaceGID, userGID) {
  try {
    const { data } = await client.teams.getTeamsForUser(`${userGID}`, {
      workspace: `${workspaceGID}`,
      opt_fields: "gid",
      opt_fields: "name",
    });
    const { choiceArray, choiceObj } = choices(data);
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
  try {
    const { data } = await client.projects.getProjectsForTeam(teamGID, {
      opt_fields: "gid",
      opt_fields: "name",
    });
    const { choiceArray, choiceObj } = choices(data);
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

    // console.log(data);
    //res.status(201).json(data);
    return data;
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
}
async function getDeal(projectGID) {
  const { data } = await client.tasks.getTasksForProject(projectGID, {
    opt_fields: "gid",
    opt_fields: "name",
  });
  console.table(data);
  return data;
}

async function getSectionList(projectGID) {
  const { data } = await client.sections.getSectionsForProject(projectGID, {
    opt_fields: "gid",
    opt_fields: "name",
  });
  const { choiceArray, choiceObj } = choices(data);
  let answers = await inquirer.prompt([
    {
      type: "list",
      name: "sections",
      message: "What section did you want to select?",
      choices: choiceArray,
    },
  ]);
  return {
    sectionGID: choiceObj[answers.sections],
    sectionName: answers.sections,
  };
}

async function getTasksInSection(sectionGID) {
  const { data } = await client.tasks.getTasksForSection(sectionGID, {
    opt_fields: "gid",
    opt_fields: "name",
  });
  return data;
}

module.exports = {
  findWorkspace,
  findUser,
  findTeam,
  findProject,
  addDeal,
  getDeal,
  getSectionList,
  getTasksInSection,
};

// function makeChoices(dataArray){
//     const choiceObj = {};
//     const choiceArray = [];
//     data.map(function (dataArray) {
//       choiceObj[dataArray.name] = dataArray.gid;
//       choiceArray.push(dataArray.name);
//     });
//     return choiceArray;

// }
