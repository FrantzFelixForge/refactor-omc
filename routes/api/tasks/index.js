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
router.post("/", async function (req, res) {
  const todaysDate = getDate();
  const newTask = {
    data: {
      approval_status: "pending",
      assignee: `${req.body.assigneeGid}`,
      assignee_status: "upcoming",
      completed: false,
      due_on: `${req.body.taskCompletionDate}`,
      liked: true,
      name: `${req.body.taskName}`,
      notes: `${req.body.taskDescription}`,
      projects: [`${req.body.projectGid}`],
      resource_subtype: "default_task",
      start_on: todaysDate,
      parent: null,
      workspace: `${req.body.workspaceGid}`,
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
