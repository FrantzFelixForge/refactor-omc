const router = require(`express`).Router();
const asana = require(`asana`);
const fetch = require(`node-fetch`);
require(`dotenv`).config();

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
router.get("/settings", async function (req, res) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );

  client.customFieldSettings
    .getCustomFieldSettingsForProject(1202402175058587)
    .then((result) => {
      res.json(result);
    });
});
router.get("/", async function (req, res) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  client.customFields
    .getCustomField(1202447185762214, {
      opt_pretty: true,
    })
    .then((result) => {
      res.json(result);
    });
});
router.put("/", async function (req, res) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  client.customFields
    .updateCustomField(1202448145530352, {
      enum_value: {
        color: "red",
        enabled: true,
        name: "High",
      },
    })
    .then((result) => {
      res.json(result);
    });
});

router.post("/", async function (req, res) {
  // const newField = {
  //   data: {
  //     format: "currency",
  //     name: "Price",
  //     precision: 2,
  //     resource_subtype: "number",
  //     workspace: "1111138376302363",
  //   },
  // };
  // try {
  //   const response = await fetch(
  //     `https://app.asana.com/api/1.0/custom_fields`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
  //       },
  //       body: JSON.stringify(newField),
  //     }
  //   );
  //   const data = await response.json();
  //   //console.log(data);
  //   res.status(201).json(data);
  // } catch (err) {
  //   console.error(err);
  //   res.status(400).json(err);
  // }
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  const newField = {
    name: "Price",
    precision: 2,
    resource_subtype: "number",
    format: "currency",
    workspace: "1111138376302363",
  };
  //   console.log(req.body)
  client.customFields
    .createCustomField(req.body)
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.delete("/", async function (req, res) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  client.customFields
    .deleteCustomField(req.body.customFieldGID)
    .then((result) => {
      res.json(result);
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;

/**
   * const newTask = {
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
   */
