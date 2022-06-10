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

module.exports = router;
