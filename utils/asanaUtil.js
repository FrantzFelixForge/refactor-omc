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

const promptUser = new UserPrompts();
async function initAsanaEnv() {
  console.log(
    "Fetching information about workspace, team, project, tags and current user..."
  );
  try {
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
  const asanaWebhook = new Webhook();
  const { data } = await asanaWebhook.getWebhooks();
  for (let i = 0; i < data.length; i++) {
    const { gid } = data[i];
    const deletedWebhookMsg = await asanaWebhook.deleteWebhook(gid);
    console.log(deletedWebhookMsg);
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
              case `Sign a document for ${selectedDeal}.`:
                console.log(
                  `A document has been signed for ${selectedDeal}, marking appropriate trade step complete...`
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
              exit();
            }
          }

          break;
        case "Get all deals in a section.":
          const asanaSection = new Section();
          const sections = await asanaSection.getSectionsByProject(projectGID);
          const [choiceArray, choiceObj] = choices(sections);
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
        case "Exit.":
          getAndDeleteWebhooks();
          exit();
          break;
        default:
          console.log("Unknown interaction: " + nextInteraction);
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
module.exports = { getAllDeals, prompts, initAsanaEnv };
