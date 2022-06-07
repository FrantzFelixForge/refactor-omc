const router = require(`express`).Router();

router.get(`/`, function (req, res) {
  res.status(200).sendFile(`../../public/index.html`);
});

module.exports = router;
