const router = require(`express`).Router();
const path = require("path");

router.get(`/`, function (req, res) {
  res
    .status(200)
    .sendFile(path.join(__dirname, `../../public/createAsanaTask.html`));
});

module.exports = router;
