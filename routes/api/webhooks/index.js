const router = require(`express`).Router();
const crypto = require("crypto");
const asana = require(`asana`);
require(`dotenv`).config();
const { Task, User, Story, Section } = require("../../../controllers");

let secret = "";

function tagToString(tag) {
  if (tag === "__OPS__") {
    return "\x1b[36moperations\x1b[0m";
  } else if (tag === "__BUYER__") {
    return "\x1b[36mbuyer\x1b[0m";
  } else if (tag === "__SELLER__") {
    return "\x1b[36mseller\x1b[0m";
  } else if (tag === "__LEGAL__") {
    return "\x1b[36mlegal\x1b[0m";
  } else if (tag === "__ISSUER__") {
    return "\x1b[36missuer\x1b[0m";
  } else if (tag === "__DEAL__") {
    return "\x1b[36mdeal\x1b[0m";
  } else {
    return "\x1b[31mun-tagged\x1b[0m";
  }
}

// /api/webhooks/receiveWebhook
router.post("/receiveWebhook", async function (req, res) {
  if (req.headers["x-hook-secret"]) {
    console.log("This is a new webhook");
    secret = req.headers["x-hook-secret"];
    process.env.SECRET = secret;
    //console.log(secret);
    res.setHeader("X-Hook-Secret", secret);
    res.sendStatus(200);
  } else if (req.headers["x-hook-signature"]) {
    const computedSignature = crypto
      .createHmac("SHA256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    // console.log(Buffer.from(computedSignature));
    // console.log(Buffer.from(req.headers["x-hook-signature"]));
    if (
      !crypto.timingSafeEqual(
        Buffer.from(req.headers["x-hook-signature"]),
        Buffer.from(computedSignature)
      )
    ) {
      res.sendStatus(401);
    } else {
      try {
        console.log(`Events on ${Date()}:`);
        // console.log(req.body.events);
        const { events } = req.body;
        const asanaUser = new User();
        const asanaTask = new Task();
        const asanaSection = new Section();
        //console.log(events);
        for (let i = 0; i < events.length; i++) {
          //console.log("Looping events...");
          const { action, user, change, resource, parent } = events[i];
          const userinfo = await asanaUser.getUser(user.gid);
          const username = `\x1b[35m${userinfo.name}\x1b[0m`;

          const touchedTask =
            resource.resource_type === "task"
              ? await asanaTask.getTask(resource.gid)
              : null;
          //console.log(events[i]);
          //   const touchedStory =
          //     resource.resource_type === "story"
          //       ? await asanaStory.getStory(resource.gid)
          //       : null;
          const isCompleteString = touchedTask?.completed
            ? "\x1b[32mcomplete\x1b[0m"
            : "\x1b[31mincomplete\x1b[0m";
          const parentTask =
            touchedTask?.parent?.resource_type === "task"
              ? await asanaTask.getTask(touchedTask.parent.gid)
              : null;

          //   console.log(
          //     "********************************",
          //     "\n",
          //     parent,
          //     "!!!!!!!!!!!!!resourceTouched!!!!!!!!!"
          //   );
          if (resource.resource_type === "task") {
            switch (action) {
              case "changed":
                // if event resource is a sub task and completed field changed
                if (
                  parentTask?.tags[0]?.name === "__DEAL__" &&
                  change.field === "completed"
                ) {
                  console.log("\x1b[33m Trade step touched \x1b[0m");

                  console.log(
                    `${username} \x1b[1;34m${action}\x1b[0m the \x1b[36m${tagToString(
                      touchedTask?.tags[0]?.name
                    )}\x1b[0m trade step \n \x1b[4m${
                      touchedTask?.name
                    }\x1b[0m to ${isCompleteString} \n on the deal \x1b[4m${
                      parentTask?.name
                    } \x1b[0m \n \n`
                  );
                }
                // if event resource is a task and completed field changed
                if (
                  touchedTask?.tags[0]?.name === "__DEAL__" &&
                  change.field === "completed"
                ) {
                  console.log("\x1b[33m Deal touched \x1b[0m");
                  console.log(
                    `${username} \x1b[1;34m${action}\x1b[0m the \x1b[36m${tagToString(
                      touchedTask?.tags[0]?.name
                    )}\x1b[0m \n\x1b[4m${
                      touchedTask?.name
                    }\x1b[0m to ${isCompleteString}. \n \n`
                  );
                }
                // if event resource is a sub task and name field changed
                if (
                  parentTask?.tags[0]?.name === "__DEAL__" &&
                  change.field === "name"
                ) {
                  console.log("\x1b[33m Trade step name touched \x1b[0m");

                  console.log(
                    `${username} \x1b[1;34m${action}\x1b[0m a ${tagToString(
                      touchedTask?.tags[0]?.name
                    )} trade step name to \n \x1b[4m${
                      touchedTask?.name
                    }\x1b[0m \n on the deal \x1b[4m${
                      parentTask?.name
                    } \x1b[0m \n \n`
                  );
                }
                // if event resource is a task and name field changed
                if (
                  touchedTask?.tags[0]?.name === "__DEAL__" &&
                  change.field === "name"
                ) {
                  console.log("\x1b[33m Deal name touched \x1b[0m");
                  console.log(
                    `${username} \x1b[1;34m${action}\x1b[0m a \x1b[36m${tagToString(
                      touchedTask?.tags[0]?.name
                    )}\x1b[0m name to \n\x1b[4m${
                      touchedTask?.name
                    }\x1b[0m. \n \n`
                  );
                }
                break;
              case "added":
                // if a tag is added and it is a sub task
                if (parent?.resource_type === "tag" && parentTask !== null) {
                  console.log("\x1b[33m Tag added to trade step \x1b[0m");

                  console.log(
                    `${username} \x1b[1;34m${action}\x1b[0m a \x1b[36m${tagToString(
                      touchedTask?.tags[0]?.name
                    )}\x1b[0m tag to the trade step \n\x1b[4m${
                      touchedTask?.name
                    }\x1b[0m. \n \n`
                  );
                }
                // if a sub task is added
                if (parent?.resource_type === "task") {
                  console.log("\x1b[33m Trade step added. \x1b[0m");
                  console.log(
                    `${username} \x1b[1;34m${action}\x1b[0m a \x1b[36m${tagToString(
                      touchedTask?.tags[0]?.name
                    )}\x1b[0m trade step named \n\x1b[4m${
                      touchedTask?.name
                    }\x1b[0m. \n \n`
                  );
                }
                // if deal is moved sections
                if (parent?.resource_type === "section") {
                  const { name } = await asanaSection.getSection(parent.gid);
                  console.log("\x1b[33m Deal moved in the pipeline \x1b[0m");
                  console.log(
                    `${username} \x1b[1;34mmoved\x1b[0m the \x1b[36m${tagToString(
                      touchedTask?.tags[0]?.name
                    )}\x1b[0m \n\x1b[4m${
                      touchedTask?.name
                    }\x1b[0m to the \n\x1b[4m${name}\x1b[0m section. \n \n`
                  );
                }
                break;
              default:
                console.log("Event not handled yet!");
                break;
            }
          }
          //   else if (resource.resource_type === "story") {
          //     switch (action) {
          //       case "added":
          //         if (resource.resource_subtype === "section_changed") {
          //           console.log("\x1b[33m Deal moved sections. \x1b[0m");
          //           const sectionMoved = touchedStory.text.split("Task");
          //           console.log(sectionMoved);

          //           console.log(
          //             `${username} moved deal \x1b[4m${touchedStory.target.name}\x1b[0m \n \x1b[32${sectionMoved[1]}}\x1b[0m \n \n`
          //           );
          //         }
          //         break;
          //       default:
          //         console.log("Story event not handled yet!");
          //         // console.log(events[i]);
          //         break;
          //     }
          //   }
        }

        //fech task
        res.sendStatus(200);
      } catch (error) {
        console.error("Error:", "\n", error);
        console.error("Asana Error:", error?.value?.errors);
        res.sendStatus(500);
      }
    }
  } else {
    console.error("Something went wrong with x-hook-signture/secret!");
  }
});

module.exports = router;

/* Example webhook request */
/*
{
    "data":{
        "filters":[
            {
                "action": "changed",
                "resource_type": "task",
                 "fields": [
          "completed",
                        "custom_fields",
                        "name"

        ]
            },	
                        {
                "action": "added",
                "resource_type": "task"	
            },	
            {
                "action": "added",
                "resource_type": "story"
            }
    ],
        "resource": "1202453205610966",
        "target": "https://1955-71-212-117-190.ngrok.io/api/webhooks/receiveWebhook"
    }
}
*/
