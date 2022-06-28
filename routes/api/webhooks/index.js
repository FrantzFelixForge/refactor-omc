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

    console.log(secret);
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
				"fields": ["due_on", "name", "notes", "liked"]
			}
		],
		"resource": "1202520364426183",
		"target": "/api/receiveWebhook"
	}
}
*/
