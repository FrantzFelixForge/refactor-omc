// const fetch = require(`node-fetch`);
// const asana = require(`asana`);
const inquirer = require("inquirer");
const { UserPrompts } = require("./inquirer");
const {
  Webhook,
  Task,
  Tag,
  Workspace,
  Project,
  User,
  Team,
  Section,
} = require("../controllers");
const { exit } = require("process");
const fetch = require("node-fetch");
const path = require("path");

const hellosign = require("hellosign-sdk")({
  key: process.env.HELLO_SIGN_API_KEY,
});

const promptUser = new UserPrompts();
async function initAsanaEnv() {
  try {
    await promptUser.welcomePrompt();
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
    const tagsObj = await asanaTag.generateTags(workspaceGID);

    const promiseResults = await Promise.all([
      { workspaceGID },
      { userGID },
      { projectGID },
      { teamGID },
      { tagsObj },
    ]);

    const results = {};

    for (let i = 0; i < promiseResults.length; i++) {
      const resolvedObj = promiseResults[i];
      const [entry] = Object.entries(resolvedObj);
      const [key, value] = entry;
      results[key] = value;
    }

    return results;
  } catch (error) {
    console.log(error);
    console.log(error?.error?.values);
    throw "Asana init Failed";
  }
}
async function getAndDeleteWebhooks() {
  console.log("Fetching webhooks for deletion..");
  try {
    const asanaWebhook = new Webhook();
    const { data } = await asanaWebhook.getWebhooks();
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      const { gid } = data[i];
      const deletedWebhookMsg = await asanaWebhook.deleteWebhook(gid);
      console.log(deletedWebhookMsg);
    }
  } catch (error) {
    console.log(error, "Webhook deletion failed");
  }
}

async function prompts(workspaceGID, userGID, projectGID, teamGID, tagsObj) {
  try {
    let runAgain = true;
    while (runAgain) {
      const nextInteraction = await promptUser.mainMenu();
      switch (nextInteraction) {
        case "Add a deal.":
          console.log("Adding a deal...");
          const asanaTask = new Task();
          const dealAdded = await asanaTask.createTask(tagsObj);
          console.table(dealAdded, ["name"]);
          console.log("Deal added...");

          break;
        case "Get all deals.":
          let anotherOperation = true;
          while (anotherOperation) {
            const { selectedDeal, dealGID, dealOptions } = await getAllDeals(
              workspaceGID,
              userGID,
              projectGID,
              teamGID,
              tagsObj
            );
            switch (dealOptions) {
              case `How many trade steps are left on ${selectedDeal}?`:
                console.log("Getting number of incomplete trade steps...");
                break;
              case `Who are the brokers/operations people assigned to ${selectedDeal}?`:
                console.log(
                  "Getting brokers/operations people assigned to this deal..."
                );
                break;
              case `Show me the term sheet for ${selectedDeal}.`:
                console.log("Getting term sheet...");
                break;
              case `Send a document for ${selectedDeal}.`:
                const docType = await promptUser.sendDocumentSelection();
                // get task's buyers/sellers
                //get rid of camelcased properties!

                switch (docType) {
                  case "Purchase Agreement":
                    try {
                      const asanaTask = new Task();
                      const dealInfo = await asanaTask.getTask(dealGID);
                      const buyerField = dealInfo.custom_fields.filter(
                        function (field) {
                          if (field.name === "Buyer") {
                            return true;
                          }
                        }
                      );
                      const buyerArr = buyerField[0].display_value.split(",");
                      const sellerField = dealInfo.custom_fields.filter(
                        function (field) {
                          if (field.name === "Seller") {
                            return true;
                          }
                        }
                      );
                      const sellerArr = sellerField[0].display_value.split(",");
                      const documentOptions = createDocument(
                        buyerArr,
                        sellerArr,
                        docType,
                        selectedDeal,
                        dealGID
                      );
                      await hellosign.signatureRequest.send(documentOptions);

                      console.log("Sending document to all parties");
                    } catch (error) {
                      console.log(error);
                    }

                    break;
                  case "Client Engagement Agreement":
                    try {
                      const asanaTask = new Task();
                      const dealInfo = await asanaTask.getTask(dealGID);
                      const buyerField = dealInfo.custom_fields.filter(
                        function (field) {
                          if (field.name === "Buyer") {
                            return true;
                          }
                        }
                      );
                      const buyerArr = buyerField[0].display_value.split(",");
                      const sellerField = dealInfo.custom_fields.filter(
                        function (field) {
                          if (field.name === "Seller") {
                            return true;
                          }
                        }
                      );
                      const sellerArr = sellerField[0].display_value.split(",");
                      console.log(buyerArr, "All the buyers");
                      console.log(sellerArr, "All the sellers");
                      const documentOptions = createDocument(
                        buyerArr,
                        sellerArr,
                        docType,
                        selectedDeal,
                        dealGID
                      );
                      await hellosign.signatureRequest.send(documentOptions);

                      console.log("Sending document to all parties");
                    } catch (error) {
                      console.log(error);
                    }
                    break;
                  case "Stock Transfer Agreement":
                    try {
                      const asanaTask = new Task();
                      const dealInfo = await asanaTask.getTask(dealGID);
                      const buyerField = dealInfo.custom_fields.filter(
                        function (field) {
                          if (field.name === "Buyer") {
                            return true;
                          }
                        }
                      );
                      const buyerArr = buyerField[0].display_value.split(",");
                      const sellerField = dealInfo.custom_fields.filter(
                        function (field) {
                          if (field.name === "Seller") {
                            return true;
                          }
                        }
                      );
                      const sellerArr = sellerField[0].display_value.split(",");
                      console.log(buyerArr, "All the buyers");
                      console.log(sellerArr, "All the sellers");
                      const documentOptions = createDocument(
                        buyerArr,
                        sellerArr,
                        docType,
                        selectedDeal,
                        dealGID
                      );
                      await hellosign.signatureRequest.send(documentOptions);

                      console.log("Sending document to all parties");
                    } catch (error) {
                      console.log(error);
                    }
                    break;

                  default:
                    break;
                }
                console.log(
                  `Sent ${docType} to ${selectedDeal}, updating trade status...`
                );

                break;
              case `Notify the issuer for ${selectedDeal}.`:
                console.log(
                  `Issuer has been noticed for the ${selectedDeal} deal, ROFR period starts now. `
                );
                break;
              default:
                console.log(
                  `\x1b[31m  ${selectedDeal} Option is not supported\x1b[0m`
                );
                break;
            }

            let nextChoice = await promptUser.dealSpecificContinue();
            if (nextChoice === "Perform another operation.") {
              anotherOperation === true;
              // I am failing right here, I need to include this code in my getAllDeals function
              // return;
            } else if (nextChoice === "Go back.") {
              await prompts(
                workspaceGID,
                userGID,
                projectGID,
                teamGID,
                tagsObj
              );
              anotherOperation === false;
              return;
            } else {
              console.log("Exiting...");
              await getAndDeleteWebhooks();
              exit();
            }
          }

          break;
        case "Get all deals in a section.":
          const asanaSection = new Section();
          const sections = await asanaSection.getSectionsByProject(projectGID);
          const [choiceArray, choiceObj] = choices(sections);
          const answers = await inquirer.prompt([
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
        case "Exit.":
          await getAndDeleteWebhooks();
          exit();
          break;
        default:
          console.log("Unknown interaction: " + nextInteraction);
          await getAndDeleteWebhooks();
          exit();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAllDeals(
  workspaceGID = process.env.WORKSPACE_GID,
  userGID = process.env.ME_GID,
  projectGID = process.env.PROJECT_GID,
  teamGID = ENG_TEAM_GID,
  tagsObj
) {
  console.log("Getting all deals...");
  const asanaTask = new Task();
  const deals = await asanaTask.getTaskByProject(projectGID);
  console.table(deals, ["name", "completed", "assignee"]);
  //make into seperate function
  const [dealChoiceArray, dealChoiceObj] = UserPrompts.choices(deals);
  const selectedDeal = await promptUser.selectDeal(dealChoiceArray);
  if (selectedDeal === "Go back.") {
    await prompts(workspaceGID, userGID, projectGID, teamGID, tagsObj);
    return;
  }
  // const dealName = `\x1b[4m${selectedDeal}\x1b[0m`;
  const dealGID = dealChoiceObj[selectedDeal];
  const dealOptions = await promptUser.dealSpecific(selectedDeal);

  return { selectedDeal, dealGID, dealOptions };
}

function createDocument(buyerArr, sellerArr, docType, selectedDeal, dealGID) {
  console.log("Creating Document...");

  const clientArray = [...buyerArr, ...sellerArr];
  const signerObjectArray = [];
  for (let i = 0; i < clientArray.length; i++) {
    const clientName = clientArray[i];
    const signerObj = {
      email_address: `frantz.felix+${clientName.trim("")}@forgeglobal.com`,
      name: `${clientName}`,
    };
    signerObjectArray.push(signerObj);
  }

  const signing_options = {
    default_type: "draw",
    draw: true,
    type: true,
    upload: true,
    phone: false,
  };

  const field_options = {
    date_format: "DD - MM - YYYY",
  };

  var options = {
    test_mode: true,
    title: `${docType}`,
    subject: `The ${docType} we talked about`,
    message: `Please sign this ${docType} and then we can discuss more. Let me know if you have any questions.`,
    signers: signerObjectArray,

    file_url: [`${process.env.NGROK_URL}/assets/fakePA.pdf`],
    metadata: {
      dealGID: dealGID,
      dealName: selectedDeal,
      buyers: buyerArr,
      seller: sellerArr,
    },
    signing_options,
    field_options,
  };

  return options;
}
module.exports = { getAllDeals, prompts, initAsanaEnv };
