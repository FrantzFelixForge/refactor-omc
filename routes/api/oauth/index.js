const router = require("express").Router();
const fetch = require("node-fetch");
require(`dotenv`).config();
//Only works when being redirect to from asana auth endpoint
router.get(`/authCode`, function (req, res) {
  console.log(
    `Api /authCode endpoint. The auth code is: ${req.query.code} The state is: '${req.query.state}'`
  );
  res.status(200).json();
});

router.post(`/bearerToken`, async function (req, res) {
  console.log(req.body);

  const bearerRequestObj = {
    grant_type: `authorization_code`,
    client_id: "1202402089879179",
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: "http://localhost:3000/",
    code: req.body.code,
    // code_verifier: "fdsuiafhjbkewbfnmdxzvbuicxlhkvnemwavx",
  };
  try {
    const response = await fetch("https://app.asana.com/-/oauth_token", {
      method: "POST",
      body: JSON.stringify(bearerRequestObj),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const data = await response.json();

    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
