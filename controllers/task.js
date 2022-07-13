const asana = require(`asana`);
require(`dotenv`).config();
const Deal = require("../utils/deal");
const User = require("./user");
class Task {
  constructor() {
    this.client = asana.Client.create({
      logAsanaChangeWarnings: false,
    }).useAccessToken(process.env.PERSONAL_ACCESS_TOKEN);
  }

  async getTask(taskGID) {
    const { data } = await this.client.tasks.getTask(taskGID, {
      opt_fields: "tags.name, name, parent, completed",
    });
    return data;
  }
  async getTaskByProject(projectGID = process.env.PROJECT_GID) {
    const { data } = await this.client.tasks.getTasksForProject(projectGID, {
      opt_fields: "tags.name, name, completed, assignee.name",
    });
    return data;
  }

  async createTask(tagsObj) {
    // workspaceGID, projectGID, userGID,
    try {
      const fetchDeal = new Deal();
      const dealInfo = fetchDeal.getRandomDeal();
      const customFieldGIDs = {
        "Deal Type": "1202448385422158",
        "Broker 1": "1202453210511646",
        "Broker 2": "?",
        "Broker 3": "?",
        atypical: "1202453210621637",
        "atypical 2": "?",
        ID: "1202572167088291",
        "Share Quantity": "1202572093555492",
        Total: "1202572166883721",
        Commission: "1202572045852509",
        "Wire Amount": "1202572106513604",
        "Share Price": "1202572166628020",
        Issuer: "1202572166995055",
        Buyer: "1202572093904798",
        Seller: "1202572093347471",
        "Buyer Status": "1202572183549297",
        "Seller Status": "1202572109911073",
      };
      const dealTypeEnumGIDs = {
        "Fund Direct": "1202448385422159",
        Direct: "1202448385422161",
        Redepmtion: "1202448385422162",
        Transfer: "1202448385422163",
        Forward: "1202448385422160",
      };
      const atypicalGIDs = {
        "New Issuer": "1202453210621648",

        "Hong Kong": "1202453210625843",

        Offering: "1202453210626849",

        "Foreign LP Units": "1202453210628040",

        "ROFR'd": "1202453210629103",

        Blocked: "1202453210629136",

        SharesPost: "1202453210629166",
      };
      const brokerGIDS = {
        Arora: "1202453210511661",

        Reigelsperger: "1202453210514718",

        Rabinovich: "1202453210515737",

        "S. Gordon": "1202453210515908",

        Illishah: "1202453210516013",

        Lin: "1202453210519122",

        Watson: "1202453210521202",

        Chan: "1202453210523222",

        Krug: "1202453210524293",

        Saeta: "1202453210524324",

        Stranick: "1202453210526409",

        Papoutsis: "1202453210527473",

        Deyan: "1202453210528671",

        duPont: "1202453210529725",

        Smead: "1202453210531732",

        Grimes: "1202453210533808",

        Boyd: "1202453210534879",

        Mangan: "1202453210535896",

        Pacilio: "1202453210535920",

        Gendels: "1202453210538009",

        Laczkovics: "1202453210539076",

        Mooney: "1202453210540141",

        Rogoff: "1202453210542222",

        Giunta: "1202453210543271",

        "P. Gordon": "1202453210544350",

        Mace: "1202453210545406",

        Yun: "1202453210548512",

        Williams: "1202453210549520",

        Frascotti: "1202453210550594",

        Zawrotny: "1202453210551692",

        Constantine: "1202453210552889",

        Saliba: "1202453210553901",

        Capps: "1202453210557015",
      };
      const preClosingSectionGID = "1202453205610967";
      let buyerTitle = "";
      for (let i = 0; i < dealInfo.buyer.length; i++) {
        const buyer = dealInfo.buyer[i];

        if (i > 1) {
          buyerTitle = "Multi";
          break;
        } else if (i === 0) {
          buyerTitle = buyer;
        } else {
          buyerTitle = `${buyerTitle} + ` + buyer;
        }
      }
      let sellerTitle = "";
      for (let i = 0; i < dealInfo.seller.length; i++) {
        const seller = dealInfo.seller[i];

        if (i > 1) {
          sellerTitle = "Multi";
          break;
        } else if (i === 0) {
          sellerTitle = seller;
        } else {
          sellerTitle = `${sellerTitle} + ` + seller;
        }
      }
      const usersOnTeam = await new User().getUsersByTeam();

      //TODO- Get ops user from fetch deal not random
      // let operationsUserGID = "";
      // console.log(usersOnTeam.data);
      // for (let i = 0; i < usersOnTeam.data.length; i++) {
      //   const userObj = usersOnTeam.data[i];
      //   console.log(dealInfo.operations);
      //   console.log(userObj.name);
      //   if (dealInfo.operations === userObj.name) {
      //     operationsUserGID = userObj.gid;
      //     console.log(operationsUserGID);
      //   }
      // }
      const newDeal = {
        data: {
          approval_status: "pending",
          assignee: `${
            usersOnTeam.data[
              Math.floor(Math.random() * usersOnTeam.data.length)
            ].gid
          }`,
          assignee_status: "upcoming",
          completed: false,

          name: `${dealInfo.issuer} | ${sellerTitle}/${buyerTitle} | $${dealInfo.price}`,
          notes: `Term Sheet notes here`,
          projects: [`${process.env.PROJECT_GID}`],
          resource_subtype: "default_task",
          memberships: [
            {
              section: preClosingSectionGID,
              project: `${process.env.PROJECT_GID}`,
            },
          ],
          workspace: `${process.env.WORKSPACE_GID}`,
          tags: [tagsObj["__DEAL__"]],
          custom_fields: {},
        },
      };
      newDeal.data.custom_fields[customFieldGIDs["Deal Type"]] =
        dealTypeEnumGIDs[dealInfo.type];
      newDeal.data.custom_fields[customFieldGIDs["Broker 1"]] =
        brokerGIDS[dealInfo.broker];
      newDeal.data.custom_fields[customFieldGIDs["atypical"]] =
        atypicalGIDs[dealInfo.atypical];
      newDeal.data.custom_fields[customFieldGIDs["ID"]] = dealInfo.id;
      newDeal.data.custom_fields[customFieldGIDs["Share Quantity"]] =
        dealInfo.quantity;
      newDeal.data.custom_fields[customFieldGIDs["Total"]] = dealInfo.total;
      newDeal.data.custom_fields[customFieldGIDs["Commission"]] =
        dealInfo.commission;
      newDeal.data.custom_fields[customFieldGIDs["Wire Amount"]] =
        dealInfo.wireAmount;
      newDeal.data.custom_fields[customFieldGIDs["Share Price"]] =
        dealInfo.price;
      newDeal.data.custom_fields[customFieldGIDs["Issuer"]] = dealInfo.issuer;
      newDeal.data.custom_fields[customFieldGIDs["Buyer"]] =
        dealInfo.buyer.join(" ");
      newDeal.data.custom_fields[customFieldGIDs["Seller"]] =
        dealInfo.seller.join(" ");
      newDeal.data.custom_fields[customFieldGIDs["Buyer Status"]] =
        dealInfo.buyerStatus;
      newDeal.data.custom_fields[customFieldGIDs["Seller Status"]] =
        dealInfo.sellerStatus;

      const dealAdded = await this.client.tasks.createTask(newDeal.data);
      const tradeStepsAdded = await this.addSubTasks(
        dealAdded.gid,
        tagsObj,
        dealInfo.type
      );
      return { dealAdded, tradeStepsAdded };
    } catch (error) {
      console.log(error);
      console.log(error?.value?.errors);
    }
  }

  async addSubTasks(taskGID, tagsObj, dealType) {
    let subTaskArray = "";

    switch (dealType) {
      case "Fund Direct":
        subTaskArray = [
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Assign yourself to the trade",
            insert_after: null,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send CEA + buy-side fund document",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send wire instructions once KYC is approved",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side funds received",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send CEA + wire instructions template to sell-side",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send PA and to sell-side and Assure once KYC is approved",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Submit to Issuer",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__ISSUER__",
            tagGid: "",
            name: "ROFR waived",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Review STA, if new or updated send to Legal to approve",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__LEGAL__",
            tagGid: "",
            name: "STA approved by Forge Legal",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "STA signed by shareholder and Assure & returned to company",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__ISSUER__",
            tagGid: "",
            name: "STA countersigned by company",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Wire to Seller",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Seller confirmed receipt",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Assure countersigns buy-side Fund Docs via Hellosign",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Close on New Platform",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Create closing on Admin",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Map wires",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Fulfill match",
            insert_after: ``,
            subTaskGid: "",
          },
        ];
        break;
      case "Direct":
        subTaskArray = [
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side agent agreement signed",
            insert_after: null,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Create buy-side entity or confirm it exists in admin",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side MIS",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side funds received",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side NCF client signature and RR signature",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side entities only: Signatory authorization and formation document",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side invoiced (post-close)",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side commission received",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Sell-side agent agreement signed",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Create sell-side entity or confirm it exists in admin",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Sell-side MIS",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Sell-side NCF client signature and RR signature",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Sell-side entities only: Signatory authorization and formation document",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Transfer notice signed",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Transfer notice submitted + ROFR initiated",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__ISSUER__",
            tagGid: "",
            name: "ROFR waived",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__LEGAL__",
            tagGid: "",
            name: "STA approved by Forge Legal",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "STA signed and returned to company",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Collect seller wire instructions",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Relay seller wire instructions to buyer",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Seller receives funds from buyer",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__ISSUER__",
            tagGid: "",
            name: "STA countersigned by company",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Sell-side invoiced",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Sell-side commission received ",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Create closing",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Map wires",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Deal marked pending review",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Trade confirmations sent",
            insert_after: ``,
            subTaskGid: "",
          },
        ];
        break;
      case "Transfer":
        subTaskArray = [
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Draft Consent to Transfer Form",
            insert_after: null,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Transferor (Member) -Sign Transfer Form",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Transferee (Proposed Transferee) Sign Transfer Form",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Transferee New Client Form ",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Transferee MIS",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Transferee W-8/9",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Entities only: Signatory authorization and formation document",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Create closing",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Assure Sign Transfer Form",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Transfer Marked Pending Review ",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Trade Confirmation Sent",
            insert_after: ``,
            subTaskGid: "",
          },
        ];
        break;
      case "Redemption":
        subTaskArray = [
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send buy-side order documents",
            insert_after: null,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side MIS",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side NCF client signature and RR signature",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Confirm wire receipt",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Entities only: Signatory authorization and formation document",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "W-8/9",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side funds received",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Draft redemption agreement",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send redemption agreement to LP and Assure",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Redemption agreement fully signed",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Transform closed order in admin > redemption",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Collect LP wire instructions",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Wire to LP",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Create closing",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Map wires",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Assure countersignature",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Deal marked pending review",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Trade confirmations sent",
            insert_after: ``,
            subTaskGid: "",
          },
        ];

        break;
      default:
        console.log(
          "Trade steps not supported for this deal type, creating fund direct trade steps instead."
        );
        subTaskArray = [
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Assign yourself to the trade",
            insert_after: null,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send CEA + buy-side fund document",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send wire instructions once KYC is approved",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Buy-side funds received",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send CEA + wire instructions template to sell-side",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Send PA and to sell-side and Assure once KYC is approved",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Submit to Issuer",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__ISSUER__",
            tagGid: "",
            name: "ROFR waived",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Review STA, if new or updated send to Legal to approve",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__LEGAL__",
            tagGid: "",
            name: "STA approved by Forge Legal",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "STA signed by shareholder and Assure & returned to company",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__ISSUER__",
            tagGid: "",
            name: "STA countersigned by company",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Wire to Seller",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__SELLER__",
            tagGid: "",
            name: "Seller confirmed receipt",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__BUYER__",
            tagGid: "",
            name: "Assure countersigns buy-side Fund Docs via Hellosign",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Close on New Platform",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Create closing on Admin",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Map wires",
            insert_after: ``,
            subTaskGid: "",
          },
          {
            tagName: "__OPS__",
            tagGid: "",
            name: "Fulfill match",
            insert_after: ``,
            subTaskGid: "",
          },
        ];
        break;
    }

    // Easier method of creating subtasks in reverse order to get the desired order
    const reverseSubTaskArray = subTaskArray.reverse();
    try {
      const addedSubTasks = [];
      for (let i = 0; i < reverseSubTaskArray.length; i++) {
        const subTask = reverseSubTaskArray[i];
        subTask.tagGid = tagsObj[subTask.tagName];
        let currentSubTask = await this.client.tasks.createSubtaskForTask(
          taskGID,
          {
            name: subTask.name,
            tags: [`${subTask.tagGid}`],
          }
        );
        addedSubTasks.push(currentSubTask);
      }
      return addedSubTasks;
    } catch (error) {
      console.log(error?.value?.errors);
    }

    //More complicated but faster method creating subtasks in order. Requires making them with all with the /batch endpoint. Then using the setParent endpoint to insert substasks in the correct order.

    // let actions = [];
    // let actionCount = 0;
    // let requestsArray = [];
    // const responseArray = [];

    // subTaskArray.forEach(function (subTask, i) {
    //   subTask.tagGid = tagsObj[subTask.tagName];
    //   actions.push({
    //     data: {
    //       name: subTask.name,
    //       workspace: `${workspaceGID}`,
    //       tags: [`${subTask.tagGid}`],
    //     },
    //     method: "post",
    //     relative_path: `/tasks`,
    //   });
    //   actionCount++;
    //   if (actionCount === 10 || i === subTaskArray.length - 1) {
    //     requestsArray.push(actions);
    //     actionCount = 0;
    //     actions = [];
    //   }
    // });

    // requestsArray.forEach(function (request) {
    //   responseArray.push(
    //     client.batchAPI.createBatchRequest({
    //       actions: [...request],
    //     })
    //   );
    // });
    // // awaits batch requests to finish, then flattens out the responses into a single array
    // const responses = (await Promise.all(responseArray)).flat();

    // responses.forEach(function ({ body }) {
    //   const { name, gid } = body.data;
    //   subTaskArray.forEach(function (subTask, i) {
    //     if (subTask.name === name) {
    //       subTask.subTaskGid = gid;
    //     }
    //     if (subTask.name === name && i != 0) {
    //       subTask.insert_after = subTaskArray[i - 1].subTaskGid;
    //     }
    //   });
    // });
    // for (let i = 0; i < subTaskArray.length; i++) {
    //   try {
    //     if (i === 0) {
    //       await client.tasks.setParentForTask(subTaskArray[i].subTaskGid, {
    //         parent: `${taskGID}`,
    //       });
    //     } else {
    //       await client.tasks.setParentForTask(subTaskArray[i].subTaskGid, {
    //         insert_after: `${subTaskArray[i].insert_after}`,
    //         parent: `${taskGID}`,
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error.value.errors);
    //   }
    // }
  }
}

module.exports = Task;
