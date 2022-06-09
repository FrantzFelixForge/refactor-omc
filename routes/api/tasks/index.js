const router = require(`express`).Router();
const asana = require(`asana`);
const fetch = require(`node-fetch`);
require(`dotenv`).config();

const refactoringOMCProjectId = 1202402175058587;

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
router.post("/", async function (req, res) {
  const newTask = {
    data: {
      approval_status: "pending",
      assignee: "1202402171924303",
      assignee_status: "upcoming",
      completed: false,
      due_on: "2023-09-15",
      html_notes:
        "<body>Mittens <em>really</em> likes the stuff from Humboldt.</body>",
      liked: true,
      name: `${req.body.taskName}`,
      notes: "Mittens really likes the stuff from Humboldt.",
      projects: ["1202402175058587"],
      resource_subtype: "default_task",
      start_on: "2023-09-14",
      parent: null,
      workspace: "1111138376302363",
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
