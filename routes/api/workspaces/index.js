const router = require(`express`).Router();
const asana = require(`asana`);

require(`dotenv`).config();
//user-id -> 1202402171924303
//workSpace-id -> 1111138376302363
//team(engineering)-id -> 1202402175058585
//refactoringOMCProject-id -> 1202402175058587

router.get("/", async function (req, res) {
  try {
    const client = asana.Client.create().useAccessToken(
      process.env.PERSONAL_ACCESS_TOKEN
    );
    // client.workspaces.getWorkspaces
    const workspaces = await client.workspaces.getWorkspaces({
      opt_fields: "gid",
      opt_fields: "name",
    });

    res.json(workspaces.data[0]);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

module.exports = router;
