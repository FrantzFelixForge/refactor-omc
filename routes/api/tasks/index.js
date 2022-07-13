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
Custom Field example   
 {
      "gid": "1202439111719844",
      "custom_field": {
        "gid": "1200040173671306",
        "enum_options": [
          {
            "gid": "1200040173671307",
            "color": "yellow-orange",
            "enabled": true,
            "name": "Fund Direct",
            "resource_type": "enum_option"
          },
          {
            "gid": "1200040173671308",
            "color": "blue-green",
            "enabled": false,
            "name": "Forward",
            "resource_type": "enum_option"
          },
          {
            "gid": "1200040173671309",
            "color": "yellow",
            "enabled": true,
            "name": "Direct",
            "resource_type": "enum_option"
          },
          {
            "gid": "1200040173671310",
            "color": "orange",
            "enabled": true,
            "name": "Redemption",
            "resource_type": "enum_option"
          },
          {
            "gid": "1201666137817545",
            "color": "red",
            "enabled": true,
            "name": "Transfer",
            "resource_type": "enum_option"
          }
        ],
        "name": "Deal Type",
        "resource_subtype": "enum",
        "resource_type": "custom_field",
        "type": "enum"
      },
      "is_important": true,
      "parent": {
        "gid": "1202402175058587",
        "name": "Refactoring OMC",
        "resource_type": "project"
      },
      "project": {
        "gid": "1202402175058587",
        "name": "Refactoring OMC",
        "resource_type": "project"
      },
      "resource_type": "custom_field_setting"
    
} */
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
      custom_fields: req.body.custom_fields,
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
