const router = require(`express`).Router();
const crypto = require("crypto");
const asana = require(`asana`);
require(`dotenv`).config();

let secret = "";
// /api/webhooks/receiveWebhook
router.post("/receiveWebhook", function (req, res) {
  if (req.headers["x-hook-secret"]) {
    console.log("This is a new webhook");
    secret = req.headers["x-hook-secret"];

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
      console.log(`Events on ${Date()}:`);
      console.log(req.body.events);
      //fech task
      res.sendStatus(200);
    }
  } else {
    console.error("Something went wrong!");
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
		"target": "https://e372-71-212-117-190.ngrok.io/api/webhooks/receiveWebhook"
	}
}
*/
