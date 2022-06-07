const router = require("express").Router();

router.use(`/`, function (req, res) {
  res.status(200).json(`Api / endpoint`);
});

module.exports = router;
