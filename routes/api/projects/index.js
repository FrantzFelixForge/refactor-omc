const router = require(`express`).Router();
const asana = require(`asana`);
const fetch = require(`node-fetch`);
require(`dotenv`).config();

router.get("/", async function (req, res) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  try {
    const teamProjects = await client.projects.getProjectsForTeam(
      req.query.gid,
      {
        opt_fields: "gid",
        opt_fields: "name",
      }
    );

    res.json(teamProjects.data);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/addCustomField", async function (req, res) {
  //
  const newField = {
    data: {
      custom_field: `${req.body.customFieldGID}`,
      is_important: true,
    },
  };
  try {
    const response = await fetch(
      `https://app.asana.com/api/1.0/projects/${req.body.projectGID}/addCustomFieldSetting`,
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
