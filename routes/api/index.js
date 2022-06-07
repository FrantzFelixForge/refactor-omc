const router = require("express").Router();

router.get(`/success`, function (req, res) {
  res
    .status(200)
    .json(
      `Api /success endpoint. The auth token is: ${req.query.code} The state is: '${req.query.state}'`
    );
});
router.get(`/failure`, function (req, res) {
  res.status(400).json(`Api /failure endpoint. No auth token.`);
});

module.exports = router;
