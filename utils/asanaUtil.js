const fetch = require(`node-fetch`);
const asana = require(`asana`);
const inquirer = require("inquirer");
// TODO:
// Create an Asana client. Do this per request since it keeps state that
// shouldn't be shared across requests.
const client = asana.Client.create().useAccessToken(
  process.env.PERSONAL_ACCESS_TOKEN
);

function choices(data) {
  const choiceObj = {};
  const choiceArray = [];
  data.map(function (item) {
    choiceObj[item.name] = item.gid;
    choiceArray.push(item.name);
  });
  return { choiceArray, choiceObj };
}

module.exports = {
  choices,
};

// function makeChoices(dataArray){
//     const choiceObj = {};
//     const choiceArray = [];
//     data.map(function (dataArray) {
//       choiceObj[dataArray.name] = dataArray.gid;
//       choiceArray.push(dataArray.name);
//     });
//     return choiceArray;

// }

// {
//     "data": {
//       "currency_code": "EUR",
//       "custom_label": "gold pieces",
//       "custom_label_position": "suffix",
//       "description": "Development team priority",
//       "enabled": true,
//       "enum_options": [
//         {
//           "color": "blue",
//           "enabled": true,
//           "name": "Low"
//         }
//       ],
//       "enum_value": {
//         "color": "blue",
//         "enabled": true,
//         "name": "Low"
//       },
//       "format": "custom",
//       "has_notifications_enabled": true,
//       "multi_enum_values": [
//         {
//           "color": "blue",
//           "enabled": true,
//           "name": "Low"
//         }
//       ],
//       "name": "Status",
//       "number_value": 5.2,
//       "precision": 2,
//       "resource_subtype": "text",
//       "text_value": "Some Value",
//       "workspace": "1331"
//     }
//   }

// const body = {
//   data: {
//     currency_code: "EUR",

//     description: "Development team resting custom fields",
//     enabled: true,
//     format: "currency",

//     name: "Money",
//     precision: 2,
//     resource_subtype: "number",
//     workspace: "1111138376302363",
//   },
// };

// {
//     "data": {
//       "actions": [
//         {
//           "data": {
//             "assignee": "me",
//             "workspace": "1111138376302363"
//           },
//           "method": "get",
//           "options": {
//             "fields": [
//               "name",
//               "notes",
//               "completed"
//             ],
//             "limit": 3
//           },
//           "relative_path": "/tasks/1202504629382865"
//         }
//       ]
//     }
//   }
