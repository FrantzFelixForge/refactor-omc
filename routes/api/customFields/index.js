const router = require(`express`).Router();
const asana = require(`asana`);
const fetch = require(`node-fetch`);
require(`dotenv`).config();

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
  const newField = {
    data: {
      currency_code: "EUR",
      //   custom_label: "gold pieces",
      //   custom_label_position: "suffix",
      description: "Development team priority",
      enabled: true,
      //   enum_options: [
      //     {
      //       color: "blue",
      //       enabled: true,
      //       name: "Low",
      //     },
      //   ],
      //   enum_value: {
      //     color: "blue",
      //     enabled: true,
      //     name: "Low",
      //   },
      format: "currency",
      has_notifications_enabled: true,
      //   multi_enum_values: [
      //     {
      //       color: "blue",
      //       enabled: true,
      //       name: "Low",
      //     },
      //   ],
      name: "Share Price$$$",
      //   number_value: 5.2,
      precision: 2,
      resource_subtype: "number",
      //   text_value: "Some Value",
      workspace: "1111138376302363",
    },
  };
  try {
    const response = await fetch(
      `https://app.asana.com/api/1.0/custom_fields`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(newField),
      }
    );
    const data = await response.json();

    //console.log(data);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
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
