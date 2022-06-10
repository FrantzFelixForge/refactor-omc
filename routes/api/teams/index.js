const router = require(`express`).Router();
const asana = require(`asana`);

require(`dotenv`).config();
//user-id -> 1202402171924303
//workSpace-id -> 1111138376302363
//team(engineering)-id -> 1202402175058585
//refactoringOMCProject-id -> 1202402175058587

router.get("/", async function (req, res) {
  const client = asana.Client.create().useAccessToken(
    process.env.PERSONAL_ACCESS_TOKEN
  );
  try {
    const userTeams = await client.teams.getTeamsForUser(`${req.query.gid}`, {
      workspace: `${req.query.organization}`,
      opt_fields: "gid",
      opt_fields: "name",
    });
    res.json(userTeams.data);
  } catch (error) {
    console.log(error);
    res.json(error);
  }

  // client.teams.dispatchGet();
});

module.exports = router;
