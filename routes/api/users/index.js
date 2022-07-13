const router = require(`express`).Router();
const asana = require(`asana`);
require(`dotenv`).config();

router.get("/me", function (req, res) {
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

module.exports = router;
