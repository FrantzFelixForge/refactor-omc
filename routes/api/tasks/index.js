const router = require(`express`).Router();
const asana = require(`asana`);
const fetch = require(`node-fetch`);
require(`dotenv`).config();

const refactoringOMCProjectId = 1202402175058587;
function getDate() {
  const date = new Date();
  let month;
  let day;
  if (date.getMonth().toString().length < 2) {
    month = "0" + (date.getMonth() + 1);
  } else {
    month = date.getMonth() + 1;
  }
  if (date.getDate().toString().length < 2) {
    day = "0" + date.getDate();
  } else {
    day = date.getDate();
  }
  const todaysDate = `${date.getFullYear()}-${month}-${day}`;
  return todaysDate;
}
router.get("/", async function (req, res) {
  const response = await fetch(
    `https://app.asana.com/api/1.0/projects/${refactoringOMCProjectId}/tasks`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
      },
    }
  );
  const data = await response.json();

  console.log(data);
  res.json(data);
});

/*
Example of body
{ 
	"workspaceGID": 1111138376302363,
 "teamGID": 1202402175058585,
	"projectGID": 1202402175058587,
	"assigneeGID": 1202402171924303,
	"id": "DT22-6826-A",
	"issuer": "SpaceX",
	"broker": "Gordon-Rogoff",
	"operations": "Hutler",
	"buyer": "Kenny",
	"seller": "Confidential91",
	"quantity": 14286,
	"price": 70.00,
	"type": "Fund Direct",
	"total": 1000020.00,
	"commission": 50000.00,
	"date": "06-06-2022",
	"buyerStatus": "NO ACTION",
	"sellerStatus": "NO ACTION"
}
*/
router.post("/", async function (req, res) {
  const todaysDate = getDate();
  const newTask = {
    data: {
      approval_status: "pending",
      assignee: `${req.body.assigneeGID}`,
      assignee_status: "upcoming",
      completed: false,
      // due_on: `${req.body.taskCompletionDate}`,
      //liked: true,
      name: `${req.body.issuer} | ${req.body.seller}/${req.body.buyer} | $${req.body.price}`,
      notes: `Term Sheet notes here`,
      projects: [`${req.body.projectGID}`],
      resource_subtype: "default_task",
      //start_on: todaysDate,
      parent: null,
      workspace: `${req.body.workspaceGID}`,
    },
  };
  try {
    const response = await fetch(`https://app.asana.com/api/1.0/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(newTask),
    });
    const data = await response.json();

    //console.log(data);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
