const router = require(`express`).Router();
const apiRoutes = require(`./api`);

router.use(`/api`, apiRoutes);
router.use(`*`, function (req, res) {
  res.status(404).json(`404 Not Found`);
});
module.exports = router;
