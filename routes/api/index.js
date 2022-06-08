const router = require(`express`).Router();
const oauth = require(`./oauth`);
require(`dotenv`).config();

router.use(`/oauth`, oauth);

router.get("/", function (req, res) {});

module.exports = router;
