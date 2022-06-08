const router = require(`express`).Router();
const asana = require(`asana`);
const fetch = require(`node-fetch`);
require(`dotenv`).config();

router.get("/", async function (req, res) {
  const response = await fetch("https://app.asana.com/api/1.0/tasks/me", {
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
