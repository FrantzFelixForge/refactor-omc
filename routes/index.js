const router = require(`express`).Router();
const apiRoutes = require(`./api`);
const htmlRoutes = require(`./htmlRoutes`);

router.use(`/api`, apiRoutes);
router.use(`/`, htmlRoutes);

router.use(`*`, function (req, res) {
  res.status(404).json(`404 Not Found`);
});
module.exports = router;
