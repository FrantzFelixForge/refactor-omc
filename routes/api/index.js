const router = require("express").Router();
require(`dotenv`).config();

router.get(`/authCode`, function (req, res) {
  console.log(
    `Api /authCode endpoint. The auth code is: ${req.query.code} The state is: '${req.query.state}'`
  );
  res.status(200).json();
});

router.post(`/bearerToken`, function (req, res) {
  console.log(req.body);

  const bearerRequestObj = {
    grant_type: "authorization_code",
    client_id: "1202402089879179",
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: "http://localhost:3000/",
    code: req.body.code,
    // code_verifier: "fdsuiafhjbkewbfnmdxzvbuicxlhkvnemwavx",
  };
  res.json(bearerRequestObj);
});
router.get(`/failure`, function (req, res) {
  res.status(400).json(`Api /failure endpoint. No auth token.`);
});

module.exports = router;
