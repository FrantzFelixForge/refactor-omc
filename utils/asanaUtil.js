const fetch = require(`node-fetch`);
const asana = require(`asana`);
const inquirer = require("inquirer");
// TODO:
// Create an Asana client. Do this per request since it keeps state that
// shouldn't be shared across requests.
const client = asana.Client.create().useAccessToken(
  process.env.PERSONAL_ACCESS_TOKEN
);
function randomColor() {
  const tagColorArray = [
    "dark-pink",
    "dark-green",
    "dark-blue",
    "dark-red",
    "dark-teal",
    "dark-brown",
    "dark-orange",
    "dark-purple",
    "dark-warm-gray",
    "light-pink",
    "light-green",
    "light-blue",
    "light-red",
    "light-teal",
    "light-brown",
    "light-orange",
    "light-purple",
    "light-warm-gray",
  ];
  return tagColorArray[Math.floor(Math.random() * tagColorArray.length)];
}
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
// different deal types
// Fund Direct
// Direct
// Redemption
// Transfer

async function createSingleTag(workspaceGID, tagName) {
  console.log(`Creating single tag ${tagName}`);
  const tag = await client.tags.createTag({
    color: randomColor(),
    name: tagName,
    workspace: workspaceGID,
  });
  console.log(tag);
  return tag;
}

async function getAllOpsTags(workspaceGID) {
  const { data } = await client.tags.getTags({
    workspace: workspaceGID,
    opt_fields: "gid",
    opt_fields: "name",
    limit: 100,
  });
  const operationTagsArr = data.filter(function (tag) {
    if (tag.name.includes("__")) {
      return true;
    }
  });
  return operationTagsArr;
}
async function createMissingTags(workspaceGID) {
  const tagObjArray = await getAllOpsTags(workspaceGID);
  const tagArray = [];
  tagObjArray.forEach(function (tag) {
    tagArray.push(tag.name);
  });
  console.log(tagArray);
  //   tagArray.forEach(function (tag) {
  //     setTimeout(function () {
  //       deleteTag(tag.gid);
  //     }, 3000);
  //   });

  if (!tagArray.includes("__ISSUER__")) {
    await createSingleTag(workspaceGID, "__ISSUER__");
    console.log("Created tag Issuer");
  }
  if (!tagArray.includes("__BUYER__")) {
    await createSingleTag(workspaceGID, "__BUYER__");
    console.log("Created tag Buyer");
  }
  if (!tagArray.includes("__SELLER__")) {
    await createSingleTag(workspaceGID, "__SELLER__");
    console.log("Created tag Seller");
  }
  if (!tagArray.includes("__LEGAL__")) {
    await createSingleTag(workspaceGID, "__LEGAL__");
    console.log("Created tag Legal");
  }
  if (!tagArray.includes("__OPS__")) {
    await createSingleTag(workspaceGID, "__OPS__");
    console.log("Created tag Ops");
  }
  if (!tagArray.includes("__DEAL__")) {
    await createSingleTag(workspaceGID, "__DEAL__");
    console.log("Created tag Deal");
  }
  //   console.log(tagsToMake);
  //Issuer
  //Buyer
  //Seller
  //Deal
  //OPS
}
async function deleteTag(tagGID) {
  const res = await client.tags.deleteTag(tagGID);
  console.log(res);
}

async function generateTags() {}

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
  console.dir(client.customFields.dispatchPost());
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

async function createCustomField() {}

module.exports = {
  findWorkspace,
  findUser,
  findTeam,
  findProject,
  addDeal,
  getDeal,
  getSectionList,
  getTasksInSection,
  getAllOpsTags,
  createMissingTags,
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

// {
//     "data": {
//       "currency_code": "EUR",
//       "custom_label": "gold pieces",
//       "custom_label_position": "suffix",
//       "description": "Development team priority",
//       "enabled": true,
//       "enum_options": [
//         {
//           "color": "blue",
//           "enabled": true,
//           "name": "Low"
//         }
//       ],
//       "enum_value": {
//         "color": "blue",
//         "enabled": true,
//         "name": "Low"
//       },
//       "format": "custom",
//       "has_notifications_enabled": true,
//       "multi_enum_values": [
//         {
//           "color": "blue",
//           "enabled": true,
//           "name": "Low"
//         }
//       ],
//       "name": "Status",
//       "number_value": 5.2,
//       "precision": 2,
//       "resource_subtype": "text",
//       "text_value": "Some Value",
//       "workspace": "1331"
//     }
//   }

const body = {
  data: {
    currency_code: "EUR",

    description: "Development team resting custom fields",
    enabled: true,
    format: "currency",

    name: "Money",
    precision: 2,
    resource_subtype: "number",
    workspace: "1111138376302363",
  },
};
