// const exampleResponse = {
//   dealGID: dealGID,
//   dealName: selectedDeal,
//   json: {
//     event: {
//       event_time: "1348177752",
//       event_type: "signature_request_signed",
//       event_hash:
//         "3a31324d1919d7cdc849ff407adf38fc01e01107d9400b028ff8c892469ca947",
//       event_metadata: {
//         related_signature_id: "ad4d8a769b555fa5ef38691465d426682bf2c992",
//         reported_for_account_id: "63522885f9261e2b04eea043933ee7313eb674fd",
//         reported_for_app_id: null,
//       },
//     },
//     signature_request: {
//       signature_request_id: "fa5c8a0b0f492d768749333ad6fcc214c111e967",
//       title: "Purchase Agreement",
//       original_title: "Purchase Agreement",
//       subject: "Purchase Agreement we talked about",
//       message: "Please sign and return.",
//       metadata: {},
//       created_at: 1570471067,
//       is_complete: false,
//       is_declined: false,
//       has_error: false,
//       custom_fields: [],
//       response_data: [],
//       signing_url: null,
//       signing_redirect_url: null,
//       files_url:
//         "https://api.hellosign.com/v3/signature_request/files/2d055d5449fcbf016f5ebf0cf967bdd2bc42494f",
//       details_url:
//         "https://app.hellosign.com/home/manage?guid=fa5c8a0b0f492d768749333ad6fcc214c111e967",
//       requester_email_address: "me@hellosign.com",
//       signatures: [
//         {
//           signature_id: "78caf2a1d01cd39cea2bc1cbb340dac3",
//           signer_email_address: "john@example.com",
//           signer_name: "John Doe",
//           signer_role: null,
//           order: null,
//           status_code: "signed",
//           signed_at: 1346521550,
//           last_viewed_at: 1346521483,
//           last_reminded_at: null,
//           has_pin: false,
//           has_sms_auth: false,
//         },
//       ],
//       cc_email_addresses: [],
//       template_ids: null,
//       client_id: null,
//     },
//   },
// };

const { join } = require("ascii-art");
const { Task } = require("../controllers");

class HelloSignEventHandler {
  constructor({ event, signature_request }) {
    // console.log(event, "event data");
    // console.log(signature_request, "signature_request");
    this.event = event;
    this.signature_request = signature_request;
    this.deal = this?.signature_request?.metadata;
    this.hellosign = require("hellosign-sdk")({
      key: process.env.HELLO_SIGN_API_KEY,
    });

    this.callbackUrlUpdate = async function () {
      return this.hellosign.account.update({
        callback_url: `${process.env.NGROK_URL}/api/webhooks/receiveWebhookHelloSign`,
      });
    };
  }

  async handleEvent() {
    try {
      await this.callbackUrlUpdate();
      const sigReqStatus = await this.hellosign.signatureRequest.get(
        this.signature_request["signature_request_id"]
      );
      if (sigReqStatus.statusCode === 410) {
        console.log("Document from hello sign webhook no longer exsists");
        return;
      }
    } catch (error) {
      console.log(error, "");
    }
    const { event_type } = this.event;
    switch (event_type) {
      case "signature_request_viewed":
        console.log("signature_request_viewed");
        // const signatureId = this.event.event_metadata.related_signature_id;
        // let user = "";
        // for (let i = 0; i < this.signature_request.signatures.length; i++) {
        //   const signature = this.signature_request.signatures[i];
        //   if (signature.signature_id === signatureId) {
        //     user = signature.signer_name;
        //   }
        // }
        const user = this.getDocumentSigner(
          this.event.event_metadata.related_signature_id
        );
        await this.updatedStatus(
          this.deal.dealGID,
          event_type,
          this.signature_request.title,
          user
        );
        break;
      case "signature_request_signed":
        console.log("signature_request_signed");

        const documentTradeSteps = await this.mapDocumentToTradeStep(
          this.signature_request,
          this.deal.dealGID
        );

        const clientObj = await this.mapClientNameToTradeStep(
          documentTradeSteps
        );
        await this.updateClientTradeStep(this.signature_request, clientObj);
        for (const key in documentTradeSteps) {
          const docGid = documentTradeSteps[key];
          const asanaTask = new Task();
          const documentSignerTradeSteps = await asanaTask.getSubTasks(docGid);
          const incompleteTradeSteps = documentSignerTradeSteps.filter(
            function (clientTask) {
              if (clientTask.completed === false) {
                return true;
              } else {
                return false;
              }
            }
          );
          if (incompleteTradeSteps.length > 0) {
            console.log(`Still awaiting signatures for: ${key}`);
          } else {
            this.updateDocumentTradestep(docGid);
          }
          const user = this.getDocumentSigner(
            this.event.event_metadata.related_signature_id
          );
          await this.updatedStatus(
            this.deal.dealGID,
            event_type,
            this.signature_request.title,
            user
          );
        }

        console.log("updated trade step...");

        //get return val from mapDocumentToTradeStep, then
        // 'for'  each var key 'in' tradeStepDocObj
        //tradeStepDocObj[key] for tradestepGID
        // GET buyer - seller doc tradesteps one at a time
        // Once you get a tradestep, get all it's sub tasks
        //filter subtasks for tasks that are incoomplete
        //if filtererd array is not empty then don't update
        // if it is empty then update

        break;
      case "signature_request_all_signed":
        console.log("signature_request_all_signed");
        const docTradeSteps = await this.mapDocumentToTradeStep(
          this.signature_request,
          this.deal.dealGID
        );
        for (const key in docTradeSteps) {
          const docTaskGid = docTradeSteps[key];

          await this.updateDocumentTradestep(docTaskGid);
        }

        break;
      case "signature_request_sent":
        console.log("signature_request_sent...");
        let signer = "";
        for (let i = 0; i < this.signature_request?.signatures?.length; i++) {
          signer = this.signature_request.signatures[i].signer_name;
          await this.initClientStatus(
            this.deal.dealGID,
            event_type,
            signer,
            this.signature_request.title
          );
        }
        break;
      case "callback_test":
        console.log("callback_test");
        break;
    }
  }

  //document will be associated with title or meta data property?
  async mapDocumentToTradeStep(document, dealGID) {
    const { title } = document;
    const asanaTask = new Task();
    const subtasks = await asanaTask.getSubTasks(dealGID);
    const docSubtaskObj = {};
    const documentSubtaskArr = subtasks.filter(function (subtask) {
      if (subtask?.tags[0]?.name === "__DOCUMENT__") {
        return true;
      }
    });
    for (let i = 0; i < documentSubtaskArr.length; i++) {
      const docSubtask = documentSubtaskArr[i];

      if (docSubtask.name.includes(title)) {
        docSubtaskObj[docSubtask.name] = docSubtask.gid;
      }
    }
    //only viable if there is a copy of the doc for buyer&seller
    if (documentSubtaskArr.length === 2) {
      return docSubtaskObj;
    } else {
      console.log(
        "Something went wrong mapping the hello sign doc to the trade step."
      );
    }
    //get deal
    //filter through subtasks(tradesteps)
    //get subtask gid
    //return subtask gid
  }
  async mapClientNameToTradeStep(documentTradeStepObj) {
    const clientSubtaskMap = {};
    const asanaTask = new Task();
    let buySideSubtasks;
    let sellSideSubtasks;
    // console.log(documentTradeStepObj);
    for (const key in documentTradeStepObj) {
      if (key.includes("BUYER")) {
        buySideSubtasks = await asanaTask.getSubTasks(
          documentTradeStepObj[key]
        );
      } else {
        sellSideSubtasks = await asanaTask.getSubTasks(
          documentTradeStepObj[key]
        );
      }
    }
    // console.log(buySideSubtasks, sellSideSubtasks);
    buySideSubtasks.map(function ({ name, gid }) {
      if (!clientSubtaskMap[name]) {
        clientSubtaskMap[name] = gid;
      }
    });
    sellSideSubtasks.map(function ({ name, gid }) {
      if (!clientSubtaskMap[name]) {
        clientSubtaskMap[name] = gid;
      }
    });

    return clientSubtaskMap;
  }

  async updateClientTradeStep(document, clientTradeStepMap) {
    const asanaTask = new Task();
    const { signatures } = document;
    for (let i = 0; i < signatures.length; i++) {
      const signature = signatures[i];
      const { signer_name, status_code } = signature;
      if (status_code === "signed") {
        const updatedSubtask = await asanaTask.updateTask(
          clientTradeStepMap[signer_name],
          {
            completed: true,
          }
        );

        //If there is only one client that needs to sign, mark document trade step complete.
        if (updatedSubtask?.parent && signatures.length === 1) {
          await asanaTask.updateTask(updatedSubtask.parent.gid, {
            completed: true,
          });
        }
      }
    }
  }

  async updateDocumentTradestep(tradestepGID) {
    const asanaTask = new Task();
    const updatedSubtask = await asanaTask.updateTask(tradestepGID, {
      completed: true,
    });
    // console.log(updatedSubtask, `Updated ${updatedSubtask.name}`);
    return updatedSubtask;
  }

  // params: deal, status
  async initClientStatus(dealGID, eventType, docTitle, user) {
    const asanaTask = new Task();
    const status = `${user} - ${eventType} - ${docTitle} \n`;
    const { notes } = await asanaTask.getTask(dealGID);
    const noteArray = notes.split("\n");
    noteArray.push(status);

    const updatedNotes = noteArray.join("\n");

    await asanaTask.updateTask(dealGID, {
      notes: updatedNotes,
    });
  }
  async updatedStatus(dealGID, eventType, docTitle, user) {
    const asanaTask = new Task();
    const status = `${user} - ${eventType} - ${docTitle}\n`;
    const { notes } = await asanaTask.getTask(dealGID);
    const noteArray = notes.trim().split("\n");

    const newNoteArray = noteArray.map(function (note) {
      if (note.includes(user) && note.includes(docTitle)) {
        return status;
      } else if (!note) {
      } else {
        return note;
      }
    });

    const updatedNotes = newNoteArray.join("\n");

    // console.log(updatedNotes, "updated notes!");
    //if user is included in buy array stick in buyer ststaus section, else seller section
    await asanaTask.updateTask(dealGID, {
      notes: updatedNotes,
    });
  }

  //  this.event.event_metadata.related_signature_id;
  getDocumentSigner(signatureId) {
    let user = "";
    for (let i = 0; i < this.signature_request.signatures.length; i++) {
      const signature = this.signature_request.signatures[i];
      if (signature.signature_id === signatureId) {
        user = signature.signer_name;
      }
    }
    return user;
  }

  //1202572183549297 buy status gid
  //1202572109911073 seller status gid
}

module.exports = { HelloSignEventHandler };
