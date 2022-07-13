const asana = require(`asana`);
const inquirer = require("inquirer");
const art = require("ascii-art");
require(`dotenv`).config();

class UserPrompts {
  // class methods
  constructor() {}

  static choices(data) {
    const choiceObj = {};
    const choiceArray = [];
    data.map(function (item) {
      choiceObj[item.name] = item.gid;
      choiceArray.push(item.name);
    });
    return [choiceArray, choiceObj];
  }

  async welcomePrompt() {}

  async mainMenu() {
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "menu",
        message: "What do you want to do?",
        choices: [
          "Get all deals.",
          "Add a deal.",
          "Get all deals in a section.",
          "Listen for changes in Asana.",
          "Exit.",
        ],
      },
    ]);
    return answers.menu;
  }
  async mainMenuContinue() {
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "menuContinue",
        message: "What do you want to do next?",
        choices: ["Perform another operation.", "Exit."],
      },
    ]);
    return answers.menuContinue;
  }
  async dealSpecific(dealName) {
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "dealQuestion",
        message: "What do you want to do next?",
        choices: [
          `How many trade steps are left on ${dealName}?`,
          `Who are the brokers/operations people assigned to ${dealName}?`,
          // `Who is being notified (brokers/operations) when updates occur on ${dealName} ?`,
          // `Turn on notifications for ${dealName} .`,
          `Show me the term sheet for ${dealName}.`,
          `Sign a document for ${dealName}.`,
          `Notify the issuer for ${dealName}.`,
        ],
      },
    ]);
    return answers.dealQuestion;
  }
  async dealSpecificContinue() {
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "dealContinue",
        message: "What do you want to do next?",
        choices: ["Perform another operation.", "Go back.", "Exit."],
      },
    ]);
    return answers.dealContinue;
  }

  async dealsInASection(choiceArray) {
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "section",
        message: "What section did you want to select?",
        choices: choiceArray,
      },
    ]);
    return answers.section;
  }
  async selectDeal(choiceArray) {
    choiceArray.push("Go back.");
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "deal",
        message: "Which deal did you want to select?",
        choices: choiceArray,
      },
    ]);
    return answers.deal;
  }
}

module.exports = { UserPrompts };
