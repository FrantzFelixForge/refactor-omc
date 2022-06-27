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

async function createSingleTag(workspaceGID, tagName) {
  console.log(`Creating single tag ${tagName}`);
  const tag = await client.tags.createTag({
    color: randomColor(),
    name: tagName,
    workspace: workspaceGID,
  });
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
async function generateTags(workspaceGID) {
  const tagObjArray = await getAllOpsTags(workspaceGID);
  const tagArray = [];
  tagObjArray.forEach(function (tag) {
    tagArray.push(tag.name);
  });
  //delete if I don't have all the tags
  if (tagArray.length < 6) {
    console.log("Some tags are missing, recreating now...");
    tagObjArray.forEach(function (tag) {
      setTimeout(function () {
        deleteTag(tag.gid);
      }, 3000);
    });
  }

  if (!tagArray.includes("__ISSUER__")) {
    const { name, gid } = await createSingleTag(workspaceGID, "__ISSUER__");
    const tagObj = { name, gid };
    tagObjArray.push(tagObj);
    console.log(`Created tag __ISSUER__`, " \n", tagObj);
  }
  if (!tagArray.includes("__BUYER__")) {
    const { name, gid } = await createSingleTag(workspaceGID, "__BUYER__");
    const tagObj = { name, gid };
    tagObjArray.push(tagObj);
    console.log(`Created tag __BUYER__`, " \n", tagObj);
  }
  if (!tagArray.includes("__SELLER__")) {
    const { name, gid } = await createSingleTag(workspaceGID, "__SELLER__");
    const tagObj = { name, gid };
    tagObjArray.push(tagObj);
    console.log(`Created tag __SELLER__`, " \n", tagObj);
  }
  if (!tagArray.includes("__LEGAL__")) {
    const { name, gid } = await createSingleTag(workspaceGID, "__LEGAL__");
    const tagObj = { name, gid };
    tagObjArray.push(tagObj);
    console.log(`Created tag __LEGAL__`, " \n", tagObj);
  }
  if (!tagArray.includes("__OPS__")) {
    const { name, gid } = await createSingleTag(workspaceGID, "__OPS__");
    const tagObj = { name, gid };
    tagObjArray.push(tagObj);
    console.log(`Created tag __OPS__`, " \n", tagObj);
  }
  if (!tagArray.includes("__DEAL__")) {
    const { name, gid } = await createSingleTag(workspaceGID, "__DEAL__");
    const tagObj = { name, gid };
    tagObjArray.push(tagObj);
    console.log(`Created tag __DEAL__`, " \n", tagObj);
  }

  const tagsObj = {};
  tagObjArray.map(function (tag) {
    tagsObj[tag.name] = tag.gid;
  });

  return tagsObj;
}
async function deleteTag(tagGID) {
  await client.tags.deleteTag(tagGID);
  console.log(`Deleted tag ${tagGID}`);
}

async function addDeal(workspaceGID, projectGID, userGID, tagsObj, dealInfo) {
  const dealTypeCustomFieldGid = 1202448385422158;
  const dealTypeEnumGIDs = {
    "Fund Direct": "1202448385422159",
    Direct: "1202448385422161",
    Redepmtion: "1202448385422162",
    Transfer: "1202448385422163",
    Forward: "1202448385422160",
  };
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
      tags: [tagsObj["__DEAL__"]],
      custom_fields: {},
    },
  };
  newDeal.data.custom_fields[dealTypeCustomFieldGid] =
    dealTypeEnumGIDs[dealInfo.type];

  //console.log(newDeal);
  try {
    //TODO: convert to built in asana method
    const response = await fetch(`https://app.asana.com/api/1.0/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(newDeal),
    });
    const { data } = await response.json();
    await addFundDealSubTasks(data.gid, workspaceGID, tagsObj);
    // console.log(data);

    return data;
  } catch (err) {
    console.error(err);
  }
}
async function getDeal(projectGID) {
  //console.dir(client.customFields.dispatchPost());
  const { data } = await client.tasks.getTasksForProject(projectGID, {
    opt_fields: "gid",
    opt_fields: "name",
  });
  console.table(data);
  return data;
}
async function addFundDealSubTasks(taskGID, workspaceGID, tagsObj) {
  let actions = [];
  let actionCount = 0;
  const requestsArray = [];
  const responseArray = [];
  const subTaskArray = [
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Assign yourself to the trade",
      orderNumber: 1,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Send CEA + buy-side fund document",
      orderNumber: 2,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Send wire instructions once KYC is approved",
      orderNumber: 3,
      subTaskGid: "",
    },
    {
      tagName: "__BUYER__",
      tagGid: "",
      name: "Buy-side funds received",
      orderNumber: 4,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Send CEA + wire instructions template to sell-side",
      orderNumber: 5,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Send PA and to sell-side and Assure once KYC is approved",
      orderNumber: 6,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Submit to Issuer",
      orderNumber: 7,
      subTaskGid: "",
    },
    {
      tagName: "__ISSUER__",
      tagGid: "",
      name: "ROFR waived",
      orderNumber: 8,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Review STA, if new or updated send to Legal to approve",
      orderNumber: 9,
      subTaskGid: "",
    },
    {
      tagName: "__LEGAL__",
      tagGid: "",
      name: "STA approved by Forge Legal",
      orderNumber: 10,
      subTaskGid: "",
    },
    {
      tagName: "__SELLER__",
      tagGid: "",
      name: "STA signed by shareholder and Assure & returned to company",
      orderNumber: 11,
      subTaskGid: "",
    },
    {
      tagName: "__ISSUER__",
      tagGid: "",
      name: "STA countersigned by company",
      orderNumber: 12,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Wire to Seller",
      orderNumber: 13,
      subTaskGid: "",
    },
    {
      tagName: "__SELLER__",
      tagGid: "",
      name: "Seller confirmed receipt",
      orderNumber: 14,
      subTaskGid: "",
    },
    {
      tagName: "__BUYER__",
      tagGid: "",
      name: "Assure countersigns buy-side Fund Docs via Hellosign",
      orderNumber: 15,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Close on New Platform",
      orderNumber: 16,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Create closing on Admin",
      orderNumber: 17,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Map wires",
      orderNumber: 18,
      subTaskGid: "",
    },
    {
      tagName: "__OPS__",
      tagGid: "",
      name: "Fulfill match",
      orderNumber: 19,
      subTaskGid: "",
    },
  ];

  subTaskArray.forEach(function (subTask, i) {
    subTask.tagGid = tagsObj[subTask.tagName];
    actions.push({
      data: {
        name: subTask.name,
        workspace: `${workspaceGID}`,
      },
      method: "post",
      relative_path: `/tasks/${taskGID}/subtasks`,
    });
    actionCount++;
    if (actionCount === 10 || i === subTaskArray.length - 1) {
      requestsArray.push(actions);
      //   console.log("current i", i);
      //   console.log("batch request array length", requestsArray.length);
      actionCount = 0;
      actions = [];
    }
  });

  requestsArray.forEach(function (request) {
    responseArray.push(
      client.batchAPI.createBatchRequest({
        actions: [...request],
      })
    );
  });

  // awaits batch requests to finish, then flattens out the responses into a single array
  const responses = (await Promise.all(responseArray)).flat();

  responses.forEach(function ({ body }) {
    const { name, gid } = body.data;
    subTaskArray.forEach(function (subTask) {
      if (subTask.name === name) {
        subTask.subTaskGid = gid;
      }
    });
  });
  console.log(taskGID);
  console.log(subTaskArray);

  // responseArray.push(response);
  // console.log(responseArray.length, "normal");
  // responseArray = responseArray.flat();
  //   console.log(responseArray.flat().length, "flattenbed");

  //   //!!PROGRESS!! LOOK AT THIS FORMAT!!!
  //   client.batchAPI.createBatchRequest({
  //     actions: [
  //       {
  //         data: {
  //           name: subTaskNameArray[0].name,
  //           workspace: `${workspaceGID}`,
  //         },
  //         method: "post",
  //         relative_path: `/tasks/${taskGID}/subtasks`,
  //       },
  //     ],
  //   });
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((err) => {
  //       console.log("Error Here!!!!!", "\n", err.value);
  // });
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

async function getDealsInSection(sectionGID) {
  const { data } = await client.tasks.getTasksForSection(sectionGID, {
    opt_fields: "gid",
    opt_fields: "name",
  });
  return data;
}

// async function createCustomField() {}

module.exports = {
  findWorkspace,
  findUser,
  findTeam,
  findProject,
  addDeal,
  getDeal,
  getSectionList,
  getDealsInSection,
  getAllOpsTags,
  generateTags,
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

// const body = {
//   data: {
//     currency_code: "EUR",

//     description: "Development team resting custom fields",
//     enabled: true,
//     format: "currency",

//     name: "Money",
//     precision: 2,
//     resource_subtype: "number",
//     workspace: "1111138376302363",
//   },
// };

// {
//     "data": {
//       "actions": [
//         {
//           "data": {
//             "assignee": "me",
//             "workspace": "1111138376302363"
//           },
//           "method": "get",
//           "options": {
//             "fields": [
//               "name",
//               "notes",
//               "completed"
//             ],
//             "limit": 3
//           },
//           "relative_path": "/tasks/1202504629382865"
//         }
//       ]
//     }
//   }

//   subTaskNameArray.forEach(async function (subTaskObj) {
//     tagGid = tagsObj[subTaskObj.tagName];
//     setTimeout(async function () {
//maybe don't await here????
//       await client.tasks.createSubtaskForTask(taskGID, {
//         tags: [tagGid],
//         name: subTaskObj.name,
//       });
//     }, 5000);
//   });
