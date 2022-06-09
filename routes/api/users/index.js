const router = require(`express`).Router();

const asana = require(`asana`);
const fetch = require(`node-fetch`);
require(`dotenv`).config();

router.get("/", function (req, res) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );

  client.users.me().then(function (me) {
    console.log(
      `Hello world! My name is ${me.name}! My workspaces are ${me.workspaces}, my email is ${me.email}, my gid is ${me.gid}, and my photo is ${me.photo}`
    );
    res.json(me);
  });
});

router.get(`/me`, async function (req, res) {
  //user-id -> 1202402171924303
  //workSpace-id -> 1111138376302363
  //team(engineering)-id -> 1202402175058585
  //refactoringOMCProject-id -> 1202402175058587
  const response = await fetch("https://app.asana.com/api/1.0/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
    },
  });
  const data = await response.json();

  console.log(data);
  res.json(data);
});

module.exports = router;
